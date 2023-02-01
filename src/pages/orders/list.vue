<template>
  <entity-list-wrapper>
    <buttons-panel
      panel-type="list"
      :disabled-refresh="!$store.getters.directoriesProfile"
      :disabledSubmit="!$store.getters.hasPermission('docsRegistry:write')"
      @submit="create"
      @refresh="refresh"
    />
    <orders-table-settings
      v-model="settings"
      :minDate="minDate"
      @putTableToClipboard="putOrdersTableToClipboard(items)"
      :allHeaders="allHeaders"
      @updateHeaders="updateActiveHeaders"
    />
    <orders-table
      :items="items"
      :headers="headers"
      :loading="loading"
      :listOptions.sync="settings.listOptions"
      :statisticData="statisticData"
      @openDocsDialog="openDocsDialog"
    />
    <v-dialog v-model="docDialog" max-width="1300" persistent>
      <order-docs-list
        :docs="editableDocs"
        :orderId="editableOrderId"
        @cancel="cancelDocDialog"
        @save="saveDocDialog"
      />
    </v-dialog>
  </entity-list-wrapper>
</template>
<script>
import { ref } from 'vue'
import { OrderService } from '@/shared/services'
import { EntityListWrapper, ButtonsPanel } from '@/shared/ui'
import { OrdersTableSettings, OrderDocsList } from '@/widgets'
import { OrdersTable } from '@/entities/order'
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
    const editableOrderId = ref(null)
    const editableDocs = ref([])
    const docDialog = ref(false)
    const allHeaders = ORDERS_TABLE_HEADERS
    const headers = ref([])

    function updateActiveHeaders(val) {
      headers.value = val
    }

    async function openDocsDialog(orderId) {
      if (!orderId) return null
      editableOrderId.value = orderId
      const order = await OrderService.getById(orderId)
      editableDocs.value = order.docs
      docDialog.value = true
    }

    function cancelDocDialog() {
      editableDocs.value = []
      editableOrderId.value = null
      docDialog.value = false
    }

    async function saveDocDialog(val) {
      await OrderService.setDocs(editableOrderId.value, val)
      cancelDocDialog()
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
      cancelDocDialog,
      saveDocDialog,
      docDialog,
      editableDocs,
      editableOrderId,
    }
  },
}
</script>
