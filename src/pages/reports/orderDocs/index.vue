<template>
  <div class="page-wrapper">
    <ReportTitle title="Отчет по не сданным документам" />
    <ReportSettings
      @refresh="refresh"
      v-model="settings"
      :allHeaders="allHeaders"
      @changeHeaders="changeHeaders"
    />
    <ReportDataTable
      :items="items"
      :headers="headers"
      :loading="loading"
      :statisticData="statisticData"
    />
  </div>
</template>
<script setup>
import { ref } from 'vue'
import { ReportTitle } from '@/shared/ui'
import { ReportSettings, ReportDataTable } from './ui'
import { useReportData, ALL_HEADERS } from './model'

defineOptions({ name: 'OrderDocsReport' })

const allHeaders = ALL_HEADERS
const headers = ref([])

const { settings, items, refresh, loading, statisticData } = useReportData()

function changeHeaders(value) {
  headers.value = value
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
