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
      :outsourceCarriers="carrierStore.outsourceCarriers"
      @updateHeaders="changeHeaders"
    />
    <IncomingInvoiceDataTable
      v-model="settings"
      :items="items"
      :totalCount="totalCount"
      :headers="headers"
      :analyticsData="analyticsData"
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

import { useListData } from './model/useListData.js'
import { useCarrierAgreements } from '@/entities/carrierAgreement/useCarrierAgreements.js'
import { useCarrierStore } from '@/entities/carrier'

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
    const carrierStore = useCarrierStore()
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
      carrierStore,
    }
  },
}
</script>
<style></style>
