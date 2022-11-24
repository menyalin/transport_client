<template>
  <div class="page-wrapper">
    <report-title :title="pageTitle" />
    <report-settings-widget
      @refresh="refresh"
      v-model="settings"
      @changeHeaders="changeHeaders"
    />
    <report-data-table :items="items" :headers="headers" :loading="loading" />
  </div>
</template>

<script>
import { ref, watch } from 'vue'
import { useDataListPage } from '@/shared/hooks'
import { ReportTitle } from '../../shared/ui'

import {
  ReportSettingsWidget,
  useReportData,
  ReportDataTable,
} from '../../components/orderDocs'

export default {
  name: 'OrderDocsReport',
  components: {
    ReportSettingsWidget,
    ReportTitle,
    ReportDataTable,
  },
  setup(_props) {
    const historyState = window.history.state
    const initialState = { groupBy: 'month', clients: [], tks: [], state: null }
    const headers = ref([])
    const settings = ref(historyState.settings || initialState)

    const { pageTitle } = useDataListPage({
      pageTitle: 'Отчет по не сданным документам',
    })

    const { items, refresh, loading } = useReportData({ settings })

    function changeHeaders(value) {
      headers.value = value
    }

    watch(
      settings,
      () => {
        window.history.pushState({ settings: settings.value }, '')
      },
      { immediate: true }
    )

    addEventListener('popstate', (e) => {
      settings.value = e.state.settings
    })

    return {
      pageTitle,
      items,
      refresh,
      settings,
      headers,
      changeHeaders,
      loading,
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
