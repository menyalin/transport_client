<template>
  <entity-list-wrapper>
    <buttons-panel
      panel-type="list"
      :disabled-refresh="!$store.getters.directoriesProfile"
      :disabledSubmit="!$store.getters.hasPermission('paymentInvoice:write')"
      @submit="create"
      @refresh="refresh"
    />

    <payment-invoices-list-settings
      v-model="settings"
      @updateHeaders="changeHeaders"
    />
    <payment-invoice-data-table
      v-model="settings"
      :items="items"
      :headers="headers"
      :statisticData="statisticData"
      :listOptions.sync="settings.listOptions"
      :loading="loading"
    />
  </entity-list-wrapper>
</template>
<script>
import { ref } from 'vue'
// import socket from '@/socket'

import { useListData } from './model/useListData.js'
import { EntityListWrapper, ButtonsPanel } from '@/shared/ui'
import {
  PaymentInvoicesListSettings,
  PaymentInvoiceDataTable,
} from '@/entities/paymentInvoice'

export default {
  name: 'PaymentInvoiceList',
  components: {
    ButtonsPanel,
    EntityListWrapper,
    PaymentInvoicesListSettings,
    PaymentInvoiceDataTable,
  },
  setup() {
    const headers = ref([])
    function changeHeaders(val) {
      headers.value = val
    }
    const {
      create,
      refresh,
      settings,
      items,
      loading,
      statisticData,
      // onDeleteHandler,
    } = useListData()

    // socket.on('docsRegistry:deleted', onDeleteHandler)
    // onBeforeUnmount(() => {
    //   socket.off('docsRegistry:deleted', onDeleteHandler)
    // })

    return {
      create,
      refresh,
      settings,
      items,
      headers,
      changeHeaders,
      statisticData,
      loading,
    }
  },
}
</script>
<style></style>
