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
import mockOrders from './mockOrders'

export default {
  name: 'Schedule',
  components: {
    AppScheduleTable,
  },

  data() {
    return {
      period: ['2021-10-01', '2021-10-06'],
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
      return mockOrders
    },
  },

  methods: {},
}
</script>
<style></style>
