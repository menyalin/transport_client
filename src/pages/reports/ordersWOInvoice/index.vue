<template>
  <div class="page-wrapper">
    <ReportTitle title="Отчет по рейсам, не включенным в акты" />
    <ReportSettings
      v-model="settings"
      :agreementItems="agreementItems"
      :allHeaders="allHeaders"
      @changeHeaders="changeHeaders"
      @refresh="refresh"
    />
    <ReportDataTable
      :items="items"
      :headers="headers"
      :loading="loading"
      :carrierItemsMap="carrierStore.carriersMap"
      v-model:listOptions="listOptions"
      :statisticData="statisticData"
    />
  </div>
</template>
<script setup>
import { ref } from 'vue'
import { ReportTitle } from '@/shared/ui'
import { ReportSettings, ReportDataTable } from './ui'
import { useReportData, ALL_HEADERS } from './model'
import { useCarrierStore } from '@/entities/carrier/useCarrierStore'

defineOptions({ name: 'OrdersWOInvoice' })

const carrierStore = useCarrierStore()
const headers = ref([])
const allHeaders = ALL_HEADERS

const { settings, items, refresh, loading, statisticData, agreementItems, listOptions } =
  useReportData()

function changeHeaders(value) {
  headers.value = value
}
</script>
<style scoped>
.page-wrapper {
  display: flex;
  flex-direction: column;
  gap: 20px;
  padding: 15px;
}
</style>
