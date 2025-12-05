<template>
  <EntityListWrapper>
    <ButtonsPanel
      panelType="list"
      :disabledSubmit="!$store.getters.hasPermission('order:create')"
      @submit="create"
      @refresh="refresh"
    />
    <OrdersTableSettings
      v-model="settings"
      :minDate="minDate"
      :allHeaders="allHeaders"
      @putTableToClipboard="putOrdersTableToClipboard(items)"
      @updateHeaders="updateActiveHeaders"
    />
    <OrdersTable
      v-model:listOptions="settings.listOptions"
      :items="items"
      :headers="headers"
      :loading="loading"
      :statisticData="statisticData"
      @openDocsDialog="openDocsDialog"
    />
    <v-dialog v-model="docDialog" maxWidth="1300" persistent>
      <OrderDocsList
:orderId="editableOrderId"
:docs="editableDocs" @save="saveDocDialog" @cancel="cancelDocDialog"
/>
    </v-dialog>
  </EntityListWrapper>
</template>
<script>
import { ref } from 'vue'
import { EntityListWrapper, ButtonsPanel } from '@/shared/ui'
import { OrdersTable, OrderDocsList, useOrderDocs, OrdersTableSettings } from '@/entities/order'
import { useListData, putOrdersTableToClipboard } from './model'
import { ORDERS_TABLE_HEADERS } from '@/shared/constants'

export default {
  name: 'OrdersListPage',
  components: {
    EntityListWrapper,
    ButtonsPanel,
    OrdersTable,
    OrdersTableSettings,
    OrderDocsList,
  },
  setup(_props, _ctx) {
    const allHeaders = ORDERS_TABLE_HEADERS
    const headers = ref([])

    const { editableOrderId, openDocsDialog, docDialog, editableDocs, saveDocDialog, cancelDocDialog } =
      useOrderDocs()

    function updateActiveHeaders(val) {
      headers.value = val
    }

    const { refresh, create, settings, items, loading, minDate, statisticData } = useListData()

    return {
      putOrdersTableToClipboard,
      loading,
      refresh,
      create,
      settings,
      items,
      minDate,
      allHeaders,
      updateActiveHeaders,
      headers,
      statisticData,
      openDocsDialog,
      docDialog,
      editableOrderId,
      editableDocs,
      saveDocDialog,
      cancelDocDialog,
    }
  },
}
</script>
