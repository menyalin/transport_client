<template>
  <div>
    <app-schedule-setting v-if="showSetting" />
    <app-schedule-table
      :rows="scheduleRows"
      :date="date.format('YYYY-MM-DD')"
      :orders="filteredOrders"
      @changeWidth="changeWidth"
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
      date: moment(),
    }
  },
  computed: {
    scheduleRows() {
      return this.$store.getters.trucks
        .filter((item) => item.type === 'truck')
        .sort((a, b) => a.order - b.order)
    },
    filteredOrders() {
      return this.orders
    },
  },
  methods: {
    changeWidth(width) {
      this.tableWidth = width
    },
    startDragOrder(orderId) {
      // console.log('startDragOrder', orderId)
    },
    endDragOrder(orderId) {
      //  console.log('endDragOrder', orderId)
    },
    updateOrderHandler({ orderId, truckId, startDate }) {
      const editedOrder = this.orders.find((item) => item._id == orderId)
      const offsetDateInSec =
        moment(editedOrder.startPositionDate).unix() - moment(startDate).unix()
      editedOrder.truckId = truckId
      editedOrder.startPositionDate = startDate
      editedOrder.endPositionDate = moment
        .unix(moment(editedOrder.endPositionDate).unix() - offsetDateInSec)
        .format('YYYY-MM-DD HH:00')
    },
  },
}
</script>
<style></style>
