<template>
  <app-schedule-table
    :rows="scheduleRows"
    @startDragOrder="startDragOrder"
    @endDragOrder="endDragOrder"
    @updateOrder="updateOrderHandler"
  />
</template>
<script>
import AppScheduleTable from '../../components/scheduleTable'
import service from '../../services/order.service'
import periodDifferernce from '../../utils/periodDifference'

export default {
  name: 'Schedule',
  components: {
    AppScheduleTable,
  },
  data() {
    return {
      orders: [],
      titleColumnWidth: null,
    }
  },
  computed: {
    date() {
      return this.$store.getters.scheduleDate
    },
    scheduleRows() {
      const trucksInOrdersSet = new Set(
        this.$store.getters.ordersForSchedule
          .map((i) => i.truckId)
          .filter((i) => !!i)
      )
      return this.$store.getters.trucks
        .filter(
          (item) =>
            item.type === 'truck' &&
            (!item.endServiceDate || trucksInOrdersSet.has(item._id))
        )
        .sort((a, b) => a.order - b.order)
    },
  },
  watch: {
    '$store.getters.schedulePeriod': function (newPeriod, oldPeriod) {
      if (!newPeriod) return null
      if (!oldPeriod) this.getData()
      else {
      const { added, deleted } = periodDifferernce(newPeriod, oldPeriod) 
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
      // this.$store.dispatch('getOrdersForSchedule')
      this.$store.dispatch('getDowntimesForSchedule')
      this.$store.dispatch('getNotesForSchedule')
    },
    async startDragOrder(orderId) {
      service.disable({ orderId, state: true })
    },
    async endDragOrder(orderId) {
      service.disable({ orderId, state: false })
    },
    async updateOrderHandler({ orderId, truckId, startDate }) {

      service.moveOrderInSchedule({
        orderId,
        truck: truckId,
        startPositionDate: startDate,
      })
    },
  },
}
</script>
<style scoped></style>
