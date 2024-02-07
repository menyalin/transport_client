<template>
  <div class="page-wrapper">
    <report-title title="Отчет по рейсам, не включенным в акты" />
    settings: {{ settings }}
    <ReportSettings
      v-model="settings"
      :agreementItems="agreementItems"
      :allHeaders="allHeaders"
      @changeHeaders="changeHeaders"
      @refresh="refresh"
    />
  </div>
</template>
<script>
import { ref } from 'vue'
import { ReportTitle } from '../../shared/ui'

import { ReportSettings, ReportDataTable } from './ui'
import { useReportData, ALL_HEADERS } from './model'
export default {
  name: 'OrdersWOInvoice',
  components: {
    ReportSettings,
    ReportTitle,
    ReportDataTable,
  },
  setup() {
    const headers = ref([])

    const { settings, items, refresh, loading, statisticData, agreementItems } =
      useReportData()

    function changeHeaders(value) {
      headers.value = value
    }

    return {
      items,
      refresh,
      settings,
      headers,
      changeHeaders,
      loading,
      statisticData,
      agreementItems,
      allHeaders: ALL_HEADERS,
    }
  },
}
</script>
<style scoped>
.page-wrapper {
  display: flex;
  flex-direction: column;
  gap: 20px;
  padding: 30px;
}
</style>
