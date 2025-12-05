<template>
  <EntityListWrapper>
    <ButtonsPanel
      panelType="list"
      :disabledRefresh="!$store.getters.directoriesProfile"
      :disabledSubmit="!$store.getters.hasPermission('paymentInvoice:write')"
      @submit="create"
      @refresh="refresh"
    >
      <v-btn color="primary" @click="downloadHandler">
        <v-icon>mdi-download</v-icon>
        Скачать отчет
      </v-btn>
    </ButtonsPanel>

    <PaymentInvoicesListSettings v-model="settings" @updateHeaders="changeHeaders" />
    <PaymentInvoiceDataTable
      v-model="settings"
      v-model:listOptions="listOptions"
      :items="items"
      :totalCount="totalCount"
      :routesCount="routesCount"
      :total="total"
      :headers="headers"
      :loading="loading"
    />
  </EntityListWrapper>
</template>
<script>
import { ref } from 'vue'
import { useListData } from './model/useListData.js'
import { EntityListWrapper, ButtonsPanel } from '@/shared/ui'
import { PaymentInvoicesListSettings, PaymentInvoiceDataTable } from '@/entities/paymentInvoice'

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
}
</script>
<style></style>
