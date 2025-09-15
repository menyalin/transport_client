<template>
  <entity-list-wrapper>
    <buttons-panel
      panel-type="list"
      :disabledSubmit="!$store.getters.hasPermission('order:create')"
      @submit="create"
      @refresh="refresh"
    />
    <orders-table-settings
      v-model="settings"
      :minDate="minDate"
      :allHeaders="allHeaders"
      @put-table-to-clipboard="putOrdersTableToClipboard(items)"
      @update-headers="updateActiveHeaders"
    />
    <orders-table
      v-model:listOptions="settings.listOptions"
      :items="items"
      :headers="headers"
      :loading="loading"
      :statisticData="statisticData"
      @open-docs-dialog="openDocsDialog"
    />
    <v-dialog v-model="docDialog" max-width="1300" persistent>
      <order-docs-list
        :orderId="editableOrderId"
        :docs="editableDocs"
        @save="saveDocDialog"
        @cancel="cancelDocDialog"
      />
    </v-dialog>
  </entity-list-wrapper>
</template>
<script>
import { ref } from 'vue'
import { EntityListWrapper, ButtonsPanel } from '@/shared/ui'
import {
  OrdersTable,
  OrderDocsList,
  useOrderDocs,
  OrdersTableSettings,
} from '@/entities/order'
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

    const {
      editableOrderId,
      openDocsDialog,
      docDialog,
      editableDocs,
      saveDocDialog,
      cancelDocDialog,
    } = useOrderDocs()

    function updateActiveHeaders(val) {
      headers.value = val
    }

    const {
      refresh,
      create,
      settings,
      items,
      loading,
      minDate,
      statisticData,
    } = useListData()

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
