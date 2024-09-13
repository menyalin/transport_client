<template>
  <div class="page-wrapper">
    <report-title title="Отчет по рейсам, не включенным в акты" />
    <ReportSettings
      v-model="settings"
      :agreementItems="agreementItems"
      :allHeaders="allHeaders"
      @change-headers="changeHeaders"
      @refresh="refresh"
    />
    <ReportDataTable
      v-model:listOptions="listOptions"
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
  name: 'OrdersWOInvoice',
  components: {
    ReportSettings,
    ReportTitle,
    ReportDataTable,
  },
  setup() {
    const headers = ref([])

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
