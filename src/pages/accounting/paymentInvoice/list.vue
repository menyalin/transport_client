<template>
  <entity-list-wrapper>
    <buttons-panel
      panel-type="list"
      :disabled-refresh="!$store.getters.directoriesProfile"
      :disabledSubmit="!$store.getters.hasPermission('paymentInvoice:write')"
      @submit="create"
      @refresh="refresh"
    >
      <v-btn color="primary" @click="downloadHandler">
        <v-icon>mdi-download</v-icon>
        Скачать отчет
      </v-btn>
    </buttons-panel>

    <payment-invoices-list-settings
      v-model="settings"
      @update-headers="changeHeaders"
    />
    <payment-invoice-data-table
      v-model="settings"
      v-model:listOptions="listOptions"
      :items="items"
      :totalCount="totalCount"
      :routesCount="routesCount"
      :total="total"
      :headers="headers"
      :loading="loading"
    />
  </entity-list-wrapper>
</template>
<script lang="ts">
//@ts-nocheck
import { defineComponent } from 'vue'
import { ref } from 'vue'

import {
  PaymentInvoicesListSettings,
  PaymentInvoiceDataTable,
} from '@/entities/paymentInvoice'
import { EntityListWrapper, ButtonsPanel } from '@/shared/ui'

import { useListData } from './model/useListData'

export default defineComponent({
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
      totalCount,
      routesCount,
      loading,
      listOptions,
      total,
      downloadHandler,
    } = useListData()

    return {
      create,
      refresh,
      settings,
      items,
      totalCount,
      routesCount,
      headers,
      changeHeaders,
      total,
      loading,
      listOptions,
      downloadHandler,
    }
  },
})
</script>
<style></style>
