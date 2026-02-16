<template>
  <div class="page-wrapper">
    <report-title title="Отчет по рейсам, не включенным в акты" />
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
      :listOptions.sync="listOptions"
      :statisticData="statisticData"
    />
  </div>
</template>
<script>
import { ref } from 'vue'
import { ReportTitle } from '@/shared/ui'

import { ReportSettings, ReportDataTable } from './ui'
import { useReportData, ALL_HEADERS } from './model'
import { useCarrierStore } from '@/entities/carrier'
export default {
  name: 'OrdersWOInvoice',
  components: {
    ReportSettings,
    ReportTitle,
    ReportDataTable,
  },
  setup() {
    const headers = ref([])
    const carrierStore = useCarrierStore()
    const {
      settings,
      items,
      refresh,
      loading,
      statisticData,
      agreementItems,
      listOptions,
    } = useReportData()

    function changeHeaders(value) {
      headers.value = value
    }

    return {
      items,
      refresh,
      settings,
      listOptions,
      headers,
      changeHeaders,
      loading,
      statisticData,
      agreementItems,
      carrierStore,
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
