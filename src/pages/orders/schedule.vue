<template>
  <ScheduleTable
    :rows="scheduleRows"
    @startDragOrder="startDragOrder"
    @endDragOrder="endDragOrder"
    @updateOrder="updateOrderHandler"
  />
</template>
<script>
import { ScheduleTable } from '@/entities/order'
import { OrderService as service } from '@/shared/services'
import periodDifferernce from '@/modules/order/utils/periodDifference'

export default {
  name: 'Schedule',
  components: {
    ScheduleTable,
  },
  computed: {
    scheduleRows() {
      const trucksInOrdersSet = new Set(
        this.$store.getters.ordersForSchedule.map((i) => i.truckId).filter((i) => !!i)
      )

      this.$store.getters.downtimesForSchedule.forEach((i) => trucksInOrdersSet.add(i.truck))

      const showTrucksFilter = (truck) => {
        if (truck.type !== 'truck') return false

        if (
          trucksInOrdersSet.has(truck._id) ||
          this.$store.getters.fixedInScheduleTrucksIds.includes(truck._id)
        )
          return true

        if (this.$store.getters.onlyTrucksWithRoutes || truck.endServiceDate) return false
        return true
      }

      return this.$store.getters.trucks.filter(showTrucksFilter).sort((a, b) => a.order - b.order)
    },
  },

  watch: {
    '$store.getters.schedulePeriod': function (newPeriod, oldPeriod) {
      if (!newPeriod) return null
      if (!oldPeriod) this.getData()
      else {
        const { added } = periodDifferernce(newPeriod, oldPeriod)
        this.getData(added)
      }
    },
  },
  mounted() {
    if (this.$store.getters.ordersForSchedule.length === 0) {
      this.getData()
    }
  },
  methods: {
    getData(period) {
      if (!this.$store.getters.directoriesProfile) {
        this.$router.push('/profile')
        return null
      }
      if (period) service.getListForSchedule(period[0], period[1])
      else service.getListForSchedule()
      this.$store.dispatch('getDowntimesForSchedule')
      this.$store.dispatch('getNotesForSchedule')
    },
    async startDragOrder(orderId) {
      try {
        await service.disable({ orderId, state: true })
      } catch (e) {
        // eslint-disable-next-line no-console
        console.error(e)
      }
    },
    async endDragOrder(orderId) {
      try {
        await service.disable({ orderId, state: false })
      } catch (e) {
        // eslint-disable-next-line no-console
        console.error(e)
      }
    },
    async updateOrderHandler({ orderId, truckId, startDate }) {
      try {
        await service.moveOrderInSchedule({
          orderId,
          truck: truckId,
          startPositionDate: startDate,
        })
      } catch (e) {
        // eslint-disable-next-line no-console
        console.error(e)
      }
    },
  },
}
</script>
<style scoped></style>
