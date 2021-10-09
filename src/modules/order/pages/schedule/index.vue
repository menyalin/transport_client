<template>
  <div>
    <app-schedule-table
      :columns="scheduleColumns"
      :rows="scheduleRows"
      :period="period"
      :orders="filteredOrders"
    />
  </div>
</template>
<script>
import getDaysFromPeriod from '../../../common/helpers/getDaysFromPeriod'
import AppScheduleTable from '../../components/scheduleTable'
import mockTrucks from './mockTrucks'
import mockOrders from './mockOrders'

export default {
  name: 'Schedule',
  components: {
    AppScheduleTable,
  },

  data() {
    return {
      period: ['2021-10-01', '2021-10-10'],
    }
  },
  computed: {
    scheduleColumns() {
      return getDaysFromPeriod(this.period)
    },
    scheduleRows() {
      return mockTrucks
    },
    filteredOrders() {
      return mockOrders
    },
  },

  methods: {},
}
</script>
<style></style>
