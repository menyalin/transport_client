<template>
  <v-card elevation="2" border class="ma-5">
    <v-card-title>
      Подобрать рейсы для акта выполненных работ №
      {{ paymentInvoice.number || 'б/н' }}
    </v-card-title>
    <v-card-subtitle>
      <b>{{ clientName }} </b>
    </v-card-subtitle>
    <v-card-actions>
      <v-btn @click="cancelHandler" class="ma-2">Закрыть</v-btn>
      <v-btn
        @click="addToInvoiceHandler"
        class="ma-2"
        color="primary"
        :disabled="!selectedOrders.length"
      >
        Добавить в акт
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
        itemIdField="orderId"
        :items="items"
        :carrierItemsMap="carrierStore.carriersMap"
        :headers="headers"
        :loading="loading"
        v-model:options="listOptions"
        @addItem="addOrderToInvoice"
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

<script setup>
import { ref, computed } from 'vue'
import { useStore } from 'vuex'
import { PickOrdersSettings } from '@/entities/paymentInvoice'
import { OrdersTable, useOrderDocs, OrderDocsList } from '@/entities/order'
import { useListData } from './model.js'
import { PickOrdersForPaymentInvoiceHeaders } from '@/shared/constants'
import { PaymentInvoiceService } from '@/shared/services'
import { useCarrierStore } from '@/entities/carrier/useCarrierStore'

defineOptions({ name: 'PickOrdersForPaymentInvoiceFeature' })

const props = defineProps({
  paymentInvoice: {
    type: Object,
    required: true,
  },
})

const emit = defineEmits(['cancel'])

const store = useStore()
const carrierStore = useCarrierStore()

const headers = ref([])
const selectedOrders = ref([])
const { loading, settings, items, refresh, listOptions } = useListData(props.paymentInvoice)

const { editableOrderId, openDocsDialog, docDialog, editableDocs, saveDocDialog, cancelDocDialog } =
  useOrderDocs()

const client = computed(() => store.getters.partnersMap.get(props.paymentInvoice.clientId))

const clientName = computed(() => {
  return client.value?.name || '-'
})

const selectedOrdersIds = computed(() => selectedOrders.value.map((i) => i._id))

function updateActiveHeaders(val) {
  headers.value = val
}

function cancelHandler() {
  selectedOrders.value = []
  emit('cancel')
}

function refreshHandler() {
  refresh()
  selectedOrders.value = []
}

async function addOrderToInvoice(orderId) {
  await PaymentInvoiceService.addOrdersToPaymentInvoice({
    orders: [orderId],
    paymentInvoiceId: props.paymentInvoice._id,
  })

  selectedOrders.value = selectedOrders.value.filter((i) => i._id !== orderId)
  refresh()
}

async function addToInvoiceHandler() {
  await PaymentInvoiceService.addOrdersToPaymentInvoice({
    orders: selectedOrdersIds.value,
    paymentInvoiceId: props.paymentInvoice._id,
  })

  selectedOrders.value = []
  refresh()
}

const allHeaders = PickOrdersForPaymentInvoiceHeaders()
</script>
