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
    '$store.getters.schedulePeriod': function (val) {
      if (!val) return null
      this.getData()
    },
  },
  mounted() {
    if (this.$store.getters.ordersForSchedule.length === 0) {
      this.getData()
    }
  },
  methods: {
    getData() {
      if (!this.$store.getters.directoriesProfile) {
        this.$router.push('/profile')
        return null
      }
      this.$store.dispatch('getOrdersForSchedule')
      this.$store.dispatch('getDowntimesForSchedule')
      this.$store.dispatch('getNotesForSchedule')
    },
    async startDragOrder(orderId) {
      await service.disable({ orderId, state: true })
    },
    async endDragOrder(orderId) {
      await service.disable({ orderId, state: false })
    },
    async updateOrderHandler({ orderId, truckId, startDate }) {
      // const editedOrder = this.$store.getters.ordersForSchedule.find(
      //   (item) => item._id == orderId
      // )
      // if (
      //   !!editedOrder.lastPlannedDate &&
      //   new Date(startDate) > new Date(editedOrder.lastPlannedDate)
      // ) {
      //   this.$store.commit(
      //     'setError',
      //     'Начало рейса не может быть позднее планируемой даты завершения'
      //   )
      //   service.disable({ orderId, state: false })
      //   return null
      // }
      await service.moveOrderInSchedule({
        orderId,
        truck: truckId,
        startPositionDate: startDate,
      })
    },
  },
}
</script>
<style scoped></style>
