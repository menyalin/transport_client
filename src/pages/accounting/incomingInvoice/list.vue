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
      @update-headers="changeHeaders"
    />
    <IncomingInvoiceDataTable
      v-model="settings"
      v-model:listOptions="listOptions"
      :items="items"
      :totalCount="totalCount"
      :headers="headers"
      :analyticsData="analyticsData"
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

import { useListData } from './model/useListData.js'
import { useCarrierAgreements } from '@/entities/carrierAgreement/useCarrierAgreements.js'

export default {
  name: 'PaymentInvoiceList',
  components: {
    ButtonsPanel,
    EntityListWrapper,
    IncomingInvoiceListSettings,
    IncomingInvoiceDataTable,
  },
  setup() {
    const { items: allCarrierAgreements } = useCarrierAgreements()
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
      analyticsData,
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
      analyticsData,
      allCarrierAgreements,
    }
  },
}
</script>
<style></style>
