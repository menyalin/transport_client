<script setup>
import { ref, computed } from 'vue'
import { PickOrdersSettings } from '@/entities/docsRegistry'
import { OrdersTable, useOrderDocs, OrderDocsList } from '@/entities/order'
import { useListData } from './model.js'
import { PickOrdersForDocsRegistryHeaders } from '@/shared/constants'
import { DocsRegistryService } from '@/shared/services'
import { useCarrierStore } from '@/entities/carrier/useCarrierStore'
import { useStore } from 'vuex'

defineOptions({ name: 'PickOrdersFeature' })

const props = defineProps({
  docsRegistry: {
    type: Object,
    required: true,
  },
})
const emits = defineEmits(['cancel'])
const headers = ref([])
const selectedOrders = ref([])
const vuexStore = useStore()
const carrierStore = useCarrierStore()
const { loading, settings, items, refresh, listOptions } = useListData(props.docsRegistry)

const { editableOrderId, openDocsDialog, docDialog, editableDocs, saveDocDialog, cancelDocDialog } =
  useOrderDocs()

const client = computed(() => vuexStore.getters.partnersMap.get(props.docsRegistry?.client))

const placeForTransferDocs = computed(() =>
  client.value.placesForTransferDocs.find(
    (i) => i.address === props.docsRegistry?.placeForTransferDocs
  )
)

const clientName = computed(() => {
  return client.value.name || '-'
})

function updateActiveHeaders(val) {
  headers.value = val
}

function cancelHandler() {
  selectedOrders.value = []
  emits('cancel')
}

function refreshHandler() {
  refresh()
  selectedOrders.value = []
}

async function addItem(orderId) {
  await DocsRegistryService.addOrdersToRegistry({
    orders: [orderId],
    docsRegistryId: props.docsRegistry._id,
  })
  selectedOrders.value = selectedOrders.value.filter((item) => item._id !== orderId)
  refresh()
}

async function addToRegistryHandler() {
  await DocsRegistryService.addOrdersToRegistry({
    orders: selectedOrders.value,
    docsRegistryId: props.docsRegistry._id,
  })

  selectedOrders.value = []
  refresh()
}
</script>

<template>
  <v-card border class="ma-5">
    <v-card-title> Подобрать рейсы для описи № {{ docsRegistry.number }} </v-card-title>
    <v-card-subtitle>
      <b>{{ clientName }} </b>
      <span> - {{ placeForTransferDocs.title }}</span>
    </v-card-subtitle>

    <v-card-text>
      <div class="buttons-row">
        <v-btn @click="cancelHandler" class="ma-2">Закрыть</v-btn>
        <v-btn
          @click="addToRegistryHandler"
          class="ma-2"
          color="primary"
          :disabled="!selectedOrders.length"
        >
          Добавить в опись
        </v-btn>
      </div>
      <pick-orders-settings
        v-model:settings="settings"
        :allHeaders="PickOrdersForDocsRegistryHeaders()"
        @updateHeaders="updateActiveHeaders"
        @refresh="refreshHandler"
      />

      <orders-table
        v-model="selectedOrders"
        show-select
        :items
        :headers
        :loading
        v-model:options="listOptions"
        :carrierItemsMap="carrierStore.carriersMap"
        @addItem="addItem"
        @openDocsDialog="openDocsDialog"
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

<style scoped>
.buttons-row {
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
  gap: 15px;
  margin: 15px 0px;
}
</style>
