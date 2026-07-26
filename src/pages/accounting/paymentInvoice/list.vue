<template>
  <EntityListWrapper>
    <ButtonsPanel
      panel-type="list"
      :disabled-refresh="!store.getters.directoriesProfile"
      :disabled-submit="!store.getters.hasPermission('paymentInvoice:write')"
      @submit="create"
      @refresh="refresh"
    >
      <v-btn color="primary" @click="downloadHandler">
        <v-icon>mdi-download</v-icon>
        Скачать отчет
      </v-btn>
    </ButtonsPanel>

    <PaymentInvoicesListSettings
      v-model="settings"
      :clientItems="partnerStore.clients"
      @updateHeaders="changeHeaders"
    />
    <PaymentInvoiceDataTable
      v-model="settings"
      :items="items"
      :totalCount="totalCount"
      :routesCount="routesCount"
      :total="total"
      :headers="headers"
      v-model:options="listOptions"
      :loading="loading"
    />
  </EntityListWrapper>
</template>

<script setup>
import { ref } from 'vue'
import { useStore } from 'vuex'
import { useListData } from './model/useListData.js'
import { EntityListWrapper, ButtonsPanel } from '@/shared/ui'
import { usePartnerStore } from '@/entities/partner'
import { PaymentInvoicesListSettings, PaymentInvoiceDataTable } from '@/entities/paymentInvoice'

defineOptions({ name: 'PaymentInvoiceList' })

const store = useStore()
const partnerStore = usePartnerStore()

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
</script>

<style></style>
