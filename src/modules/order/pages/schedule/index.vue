<template>
  <div>
    <app-schedule-setting
      v-if="showSetting"
      :date="date"
      @incDate="incDate"
      @setDate="setDate"
    />
    <app-schedule-table
      :rows="scheduleRows"
      :date="date"
      @startDragOrder="startDragOrder"
      @endDragOrder="endDragOrder"
      @updateOrder="updateOrderHandler"
      @showSetting="showSetting = !showSetting"
    />
  </div>
</template>
<script>
import moment from 'moment'

import AppScheduleTable from '../../components/scheduleTable'
import AppScheduleSetting from '../../components/scheduleSetting'
import mockOrders from './mockOrders'
import service from '../../services/order.service'

export default {
  name: 'Schedule',
  components: {
    AppScheduleTable,
    AppScheduleSetting,
  },
  data() {
    return {
      orders: mockOrders,
      showSetting: true,
      titleColumnWidth: null,
    }
  },
  computed: {
    date() {
      return this.$store.getters.scheduleDate
    },
    scheduleRows() {
      return this.$store.getters.trucks
        .filter((item) => item.type === 'truck')
        .sort((a, b) => a.order - b.order)
    },
  },
  watch: {
    '$store.getters.schedulePeriod': function (val) {
      if (!val) return null
      this.getOrders()
    },
  },
  mounted() {
    if (this.$store.getters.ordersForSchedule.length === 0) {
      this.getOrders()
    }
  },
  methods: {
    getOrders() {
      this.$store.dispatch('getOrders')
      this.$store.dispatch('getDowntimes')
    },
    incDate(count) {
      this.$store.commit('incScheduleDate', count)
    },
    setDate(date) {
      if (!date)
        this.$store.commit('setScheduleDate', moment().format('YYYY-MM-DD'))
      else this.$store.commit('setScheduleDate', date)
    },
    startDragOrder(orderId) {
      service.disable({ orderId, state: true })
    },
    endDragOrder(orderId) {
      service.disable({ orderId, state: false })
    },
    updateOrderHandler({ orderId, truckId, startDate }) {
      const editedOrder = this.$store.getters.ordersForSchedule.find(
        (item) => item._id == orderId
      )
      if (
        !!editedOrder.lastPlannedDate &&
        new Date(startDate) > new Date(editedOrder.lastPlannedDate)
      ) {
        this.$store.commit(
          'setError',
          'Начало рейса не может быть позднее планируемой даты завершения'
        )
        service.disable({ orderId, state: false })
        return null
      }

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
