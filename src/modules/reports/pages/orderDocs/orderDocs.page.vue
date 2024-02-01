<template>
  <div class="page-wrapper">
    <report-title title="Отчет по не сданным документам" />
    <report-settings
      @refresh="refresh"
      v-model="settings"
      :allHeaders="allHeaders"
      @changeHeaders="changeHeaders"
    />
    <report-data-table
      :items="items"
      :headers="headers"
      :loading="loading"
      :statisticData="statisticData"
    />
  </div>
</template>

<script>
import { ref } from 'vue'
import { ReportTitle } from '../../shared/ui'

import { ReportSettings, ReportDataTable } from './ui'
import { useReportData, ALL_HEADERS } from './model'

export default {
  name: 'OrderDocsReport',
  components: {
    ReportSettings,
    ReportTitle,
    ReportDataTable,
  },
  setup() {
    const headers = ref([])

    const { settings, items, refresh, loading, statisticData } = useReportData()

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
