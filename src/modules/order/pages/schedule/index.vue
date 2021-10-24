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
      :orders="filteredOrders"
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
      showSetting: false,
      date: moment().format('YYYY-MM-DD'),
    }
  },
  computed: {
    scheduleRows() {
      return this.$store.getters.trucks
        .filter((item) => item.type === 'truck')
        .sort((a, b) => a.order - b.order)
    },
    filteredOrders() {
      return this.$store.getters.ordersForSchedule
    },
  },
  watch: {
    '$store.getters.schedulePeriod': function (val, oldVal) {
      if (!val) return null
      this.getOrders()
    },
  },
  methods: {
    getOrders() {
      this.$store.dispatch('getOrders')
    },
    incDate(count) {
      this.date = moment(this.date).add(count, 'day').format('YYYY-MM-DD')
    },
    setDate(date) {
      if (!date) this.date = moment().format('YYYY-MM-DD')
      else this.date = date
    },
    // changeWidth(width) {
    //   this.tableWidth = width
    // },
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
      const offsetDateInSec =
        moment(editedOrder.startPositionDate).unix() - moment(startDate).unix()
      const endDate = moment
        .unix(moment(editedOrder.endPositionDate).unix() - offsetDateInSec)
        .format('YYYY-MM-DD HH:00')
      service.moveOrderInSchedule({
        orderId,
        truck: truckId,
        startPositionDate: startDate,
        endPositionDate: endDate,
      })
    },
  },
}
</script>
<style></style>
