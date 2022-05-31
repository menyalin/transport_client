<template>
  <div id="wrapper">
    <div id="header">
      <h4>Валовая прибыль за период</h4>
    </div>
    <div id="settings">
      <v-btn
        icon
        @click.stop="getData"
      >
        <v-icon> mdi-cached </v-icon>
      </v-btn>
      <app-date-range v-model="settings.dateRange" />
    </div>
    <v-progress-linear
      v-if="loading"
      indeterminate
      color="primary"
      striped
      rounded
    />
    <div
      v-else
      id="report-body"
    >
      <app-report-summary />
    </div>
  </div>
</template>
<script>
import AppDateRange from '@/modules/common/components/dateRange2'
import AppReportSummary from './reportSummary'
import initDateRange from './initDateRange.js'
import ReportService from '../../services/index.js'

export default {
  name: 'GrossProfitReport',
  components: {
    AppDateRange,
    AppReportSummary,
  },
  data() {
    return {
      settings: {
        dateRange: initDateRange(),
      },
      orders: [],
      loading: false,
    }
  },
  methods: {
    async getData() {
      this.orders = await ReportService.grossProfit()
    }
  }
}
</script>
<style scoped>
#wrapper {
  margin: 10px;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

#settings {
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
  margin: 0 30px;
  gap: 10px;
}
#report-body {
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: start;
  width: 100%;
}
</style>
