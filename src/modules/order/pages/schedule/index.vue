<template>
  <div>
    <app-schedule-table
      :columns="scheduleColumns"
      :rows="scheduleRows"
      :period="period"
      :orders="filteredOrders"
      @startDragOrder="startDragOrder"
      @endDragOrder="endDragOrder"
      @updateOrder="updateOrderHandler"
    />
  </div>
</template>
<script>
import moment from 'moment'
import getDaysFromPeriod from '../../../common/helpers/getDaysFromPeriod'
import AppScheduleTable from '../../components/scheduleTable'
import mockOrders from './mockOrders'

export default {
  name: 'Schedule',
  components: {
    AppScheduleTable,
  },

  data() {
    return {
      period: ['2021-10-01', '2021-10-06'],
      orders: mockOrders,
    }
  },
  computed: {
    scheduleColumns() {
      return getDaysFromPeriod(this.period)
    },
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
