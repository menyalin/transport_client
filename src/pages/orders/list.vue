<template>
  <EntityListWrapper>
    <ButtonsPanel
      panel-type="list"
      :disabledSubmit="!$store.getters.hasPermission('order:create')"
      @submit="create"
      @refresh="refresh"
    />
    <OrdersTableSettings
      v-model="settings"
      :minDate="minDate"
      @putTableToClipboard="putOrdersTableToClipboard(items)"
      :allHeaders="allHeaders"
      :carrierItems="carrierStore.carriers"
      @updateHeaders="updateActiveHeaders"
    />

    <OrdersTable
      :items="items"
      :headers="headers"
      :loading="loading"
      v-model:options="listOptions"
      :statisticData="statisticData"
      :carrierItemsMap="carrierStore.carriersMap"
      @openDocsDialog="openDocsDialog"
    />
    <v-dialog v-model="docDialog" max-width="1300" persistent>
      <OrderDocsList
        :orderId="editableOrderId"
        :docs="editableDocs"
        @save="saveDocDialog"
        @cancel="cancelDocDialog"
      />
    </v-dialog>
  </EntityListWrapper>
</template>
<script setup>
import { ref } from 'vue'
import { EntityListWrapper, ButtonsPanel } from '@/shared/ui'
import { OrdersTable, OrderDocsList, useOrderDocs, OrdersTableSettings } from '@/entities/order'
import { useListData, putOrdersTableToClipboard } from './model'
import { ORDERS_TABLE_HEADERS } from '@/shared/constants'
import { useCarrierStore } from '@/entities/carrier/useCarrierStore'

defineOptions({ name: 'OrdersListPage' })

const carrierStore = useCarrierStore()
const allHeaders = ORDERS_TABLE_HEADERS
const headers = ref([])

const { editableOrderId, openDocsDialog, docDialog, editableDocs, saveDocDialog, cancelDocDialog } =
  useOrderDocs()

function updateActiveHeaders(val) {
  headers.value = val
}
const { refresh, create, settings, items, loading, minDate, statisticData, listOptions } =
  useListData()
</script>
