<template>
  <entity-list-wrapper>
    <buttons-panel
      panel-type="list"
      :disabled-refresh="!store.getters.directoriesProfile"
      :disabled-submit="!store.getters.hasPermission('incomingInvoice:write')"
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
      v-model:options="listOptions"
      :loading="loading"
    />
  </entity-list-wrapper>
</template>

<script setup>
import { useStore } from 'vuex'
import { EntityListWrapper, ButtonsPanel } from '@/shared/ui'
import { IncomingInvoiceListSettings, IncomingInvoiceDataTable } from '@/entities/incomingInvoice'

import { useListData } from './model/useListData.js'
import { useCarrierAgreements } from '@/entities/carrierAgreement/useCarrierAgreements.js'
import { useCarrierStore } from '@/entities/carrier/useCarrierStore'

defineOptions({ name: 'PaymentInvoiceList' })

const store = useStore()
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
  headers,
  changeHeaders,
  analyticsData,
} = useListData()
</script>

<style></style>
