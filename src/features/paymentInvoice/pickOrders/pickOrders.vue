<template>
  <v-card elevation="2" outlined class="ma-5">
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
        :headers="headers"
        :loading="loading"
        :listOptions.sync="settings.listOptions"
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
<script>
import store from '@/store'
import { ref, computed } from 'vue'
import { PickOrdersSettings } from '@/entities/paymentInvoice'
import { OrdersTable, useOrderDocs, OrderDocsList } from '@/entities/order'
import { useListData } from './model.js'
import { PickOrdersForPaymentInvoiceHeaders } from '@/shared/constants'
import { PaymentInvoiceService } from '@/shared/services'

export default {
  name: 'PickOrdersForPaymentInvoiceFeature',
  components: { PickOrdersSettings, OrdersTable, OrderDocsList },
  props: {
    paymentInvoice: {
      type: Object,
      required: true,
    },
  },
  setup({ paymentInvoice }, ctx) {
    const headers = ref([])
    const selectedOrders = ref([])
    const { loading, settings, items, refresh } = useListData(paymentInvoice)

    const {
      editableOrderId,
      openDocsDialog,
      docDialog,
      editableDocs,
      saveDocDialog,
      cancelDocDialog,
    } = useOrderDocs()

    const client = computed(() =>
      store.getters.partnersMap.get(paymentInvoice.client)
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

    async function addOrderToInvoice(orderId) {
      await PaymentInvoiceService.addOrdersToPaymentInvoice({
        orders: [orderId],
        paymentInvoiceId: paymentInvoice._id,
      })

      selectedOrders.value = selectedOrders.value.filter(
        (i) => i._id !== orderId
      )
      refresh()
    }

    async function addToInvoiceHandler() {
      await PaymentInvoiceService.addOrdersToPaymentInvoice({
        orders: selectedOrdersIds.value,
        paymentInvoiceId: paymentInvoice._id,
      })

      selectedOrders.value = []
      refresh()
    }
    return {
      cancelHandler,
      addToInvoiceHandler,
      loading,
      updateActiveHeaders,
      allHeaders: PickOrdersForPaymentInvoiceHeaders(),
      settings,
      items,
      headers,
      refreshHandler,
      selectedOrders,
      selectedOrdersIds,
      clientName,
      client,
      addOrderToInvoice,

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
