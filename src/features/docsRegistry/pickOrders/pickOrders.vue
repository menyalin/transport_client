<template>
  <v-card elevation="2" variant="outlined" class="ma-5">
    <v-card-title>
      Подобрать рейсы для описи № {{ docsRegistry.number }}
    </v-card-title>
    <v-card-subtitle>
      <b>{{ clientName }} </b>
      <span>{{ placeForTransferDocs.title }}</span>
    </v-card-subtitle>
    <v-card-actions>
      <v-btn class="ma-2" @click="cancelHandler">Закрыть</v-btn>
      <v-btn
        class="ma-2"
        color="primary"
        :disabled="!selectedOrders.length"
        @click="addToRegistryHandler"
      >
        Добавить в опись
      </v-btn>
    </v-card-actions>
    <v-card-text>
      <pick-orders-settings
        v-model="settings"
        :allHeaders="allHeaders"
        @update-headers="updateActiveHeaders"
        @refresh="refreshHandler"
      />
      <orders-table
        v-model="selectedOrders"
        v-model:listOptions="settings.listOptions"
        show-select
        :items="items"
        :headers="headers"
        :loading="loading"
        @add-item="addItem"
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
    </v-card-text>
  </v-card>
</template>
<script>
import store from '@/store'
import { ref, computed } from 'vue'
import { PickOrdersSettings } from '@/entities/docsRegistry'
import { OrdersTable, useOrderDocs, OrderDocsList } from '@/entities/order'
import { useListData } from './model.js'
import { PickOrdersForDocsRegistryHeaders } from '@/shared/constants'
import { DocsRegistryService } from '@/shared/services'

export default {
  name: 'PickOrdersFeature',
  components: { PickOrdersSettings, OrdersTable, OrderDocsList },
  props: {
    docsRegistry: {
      type: Object,
      required: true,
    },
  },
  setup({ docsRegistry }, ctx) {
    const headers = ref([])
    const selectedOrders = ref([])
    const { loading, settings, items, refresh } = useListData(docsRegistry)

    const {
      editableOrderId,
      openDocsDialog,
      docDialog,
      editableDocs,
      saveDocDialog,
      cancelDocDialog,
    } = useOrderDocs()

    const client = computed(() =>
      store.getters.partnersMap.get(docsRegistry.client)
    )

    const placeForTransferDocs = computed(() =>
      client.value.placesForTransferDocs.find(
        (i) => i.address === docsRegistry.placeForTransferDocs
      )
    )

    const clientName = computed(() => {
      return client.value.name || '-'
    })

    const selectedOrdersIds = computed(() =>
      selectedOrders.value.map((i) => i._id)
    )

    function updateActiveHeaders(val) {
      headers.value = val
    }

    function cancelHandler() {
      selectedOrders.value = []
      ctx.emit('cancel')
    }

    function refreshHandler() {
      refresh()
      selectedOrders.value = []
    }

    async function addItem(orderId) {
      await DocsRegistryService.addOrdersToRegistry({
        orders: [orderId],
        docsRegistryId: docsRegistry._id,
      })
      selectedOrders.value = selectedOrders.value.filter(
        (item) => item._id !== orderId
      )
      refresh()
    }

    async function addToRegistryHandler() {
      await DocsRegistryService.addOrdersToRegistry({
        orders: selectedOrdersIds.value,
        docsRegistryId: docsRegistry._id,
      })

      selectedOrders.value = []
      refresh()
    }
    return {
      cancelHandler,
      addToRegistryHandler,
      loading,
      updateActiveHeaders,
      allHeaders: PickOrdersForDocsRegistryHeaders(),
      settings,
      items,
      headers,
      refreshHandler,
      selectedOrders,
      selectedOrdersIds,
      clientName,
      placeForTransferDocs,
      client,
      addItem,

      editableOrderId,
      openDocsDialog,
      docDialog,
      editableDocs,
      saveDocDialog,
      cancelDocDialog,
    }
  },
}
</script>
