<template>
  <v-card elevation="2" outlined class="ma-5">
    <v-card-title>
      Подобрать рейсы для описи № {{ docsRegistry.number }}
    </v-card-title>
    <v-card-subtitle>
      <b>{{ clientName }} </b>
      <span>{{ placeForTransferDocs.title }}</span>
    </v-card-subtitle>
    <v-card-actions>
      <v-btn @click="cancelHandler" class="ma-2">Закрыть</v-btn>
      <v-btn
        @click="addToRegistryHandler"
        class="ma-2"
        color="primary"
        :disabled="!selectedOrders.length"
      >
        Добавить в опись
      </v-btn>
    </v-card-actions>
    <v-card-text>
      <pick-orders-settings
        v-model="settings"
        :allHeaders="allHeaders"
        @updateHeaders="updateActiveHeaders"
        @refresh="refreshHandler"
      />

      <orders-table
        v-model="selectedOrders"
        show-select
        :items="items"
        :headers="headers"
        :loading="loading"
        :listOptions.sync="settings.listOptions"
      />
    </v-card-text>
  </v-card>
</template>
<script>
// todo: @openDocsDialog="openDocsDialog"
import store from '@/store'
import { ref, computed } from 'vue'
import { PickOrdersSettings } from '@/entities/docsRegistry'
import { OrdersTable } from '@/entities/order'
import { useListData } from './model.js'
import { ORDERS_TABLE_HEADERS } from '@/shared/constants'
import { DocsRegistryService } from '@/shared/services'

export default {
  name: 'PickOrdersFeature',
  components: { PickOrdersSettings, OrdersTable },
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
      allHeaders: ORDERS_TABLE_HEADERS,
      settings,
      items,
      headers,
      refreshHandler,
      selectedOrders,
      selectedOrdersIds,
      clientName,
      placeForTransferDocs,
      client,
    }
  },
}
</script>
