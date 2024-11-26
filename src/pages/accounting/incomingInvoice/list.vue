<template>
  <entity-list-wrapper>
    <buttons-panel
      panel-type="list"
      :disabled-refresh="!$store.getters.directoriesProfile"
      :disabledSubmit="!$store.getters.hasPermission('incomingInvoice:write')"
      @submit="create"
      @refresh="refresh"
    />
    <IncomingInvoiceListSettings
      v-model="settings"
      :agreementItems="allCarrierAgreements"
      @updateHeaders="changeHeaders"
    />
    <IncomingInvoiceDataTable
      v-model="settings"
      :items="items"
      :totalCount="totalCount"
      :headers="headers"
      :listOptions.sync="listOptions"
      :loading="loading"
    />
  </entity-list-wrapper>
</template>
<script>
import { EntityListWrapper, ButtonsPanel } from '@/shared/ui'
import {
  IncomingInvoiceListSettings,
  IncomingInvoiceDataTable,
} from '@/entities/incomingInvoice'
import { useAgreements } from '@/entities/agreement'
import { useListData } from './model/useListData.js'

export default {
  name: 'PaymentInvoiceList',
  components: {
    ButtonsPanel,
    EntityListWrapper,
    IncomingInvoiceListSettings,
    IncomingInvoiceDataTable,
  },
  setup() {
    const { allCarrierAgreements } = useAgreements()
    const {
      create,
      refresh,
      settings,
      items,
      totalCount,
      loading,
      listOptions,
      total,
      downloadHandler,
      headers,
      changeHeaders,
    } = useListData()

    return {
      create,
      refresh,
      settings,
      items,
      totalCount,
      headers,
      changeHeaders,
      total,
      loading,
      listOptions,
      downloadHandler,
      allCarrierAgreements,
    }
  },
}
</script>
<style></style>
