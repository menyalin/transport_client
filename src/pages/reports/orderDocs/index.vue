<template>
  <div class="page-wrapper">
    <report-title title="Отчет по не сданным документам" />
    <report-settings
      v-model="settings"
      :allHeaders="allHeaders"
      @refresh="refresh"
      @change-headers="changeHeaders"
    />
    <report-data-table
      :items="items"
      :headers="headers"
      :loading="loading"
      :statisticData="statisticData"
    />
  </div>
</template>

<script lang="ts">
//@ts-nocheck
import { defineComponent } from 'vue'
import { ref } from 'vue'

import { ReportTitle } from '@/shared/ui'

import { useReportData, ALL_HEADERS } from './model'
import { ReportSettings, ReportDataTable } from './ui'

export default defineComponent({
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
})
</script>

<style scoped>
.page-wrapper {
  display: flex;
  flex-direction: column;
  gap: 20px;
  padding: 30px;
}
</style>
