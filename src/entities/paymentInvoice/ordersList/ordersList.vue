<template>
  <v-data-table
    :items="preparedOrders"
    :headers="headers"
    v-model="selected"
    multiple
    item-key="rowId"
    checkbox-color="primary"
    show-select
    :itemsPerPage="-1"
    :footerProps="{
      itemsPerPageOptions: [-1, 100],
    }"
    dense
    @dblclick:row="dblclickRowHandler"
  >
    <template v-slot:top>
      <v-btn
        :disabled="!selectedOrderIds.length"
        small
        text
        color="error"
        @click="deleteHandler"
      >
        Удалить выделенные рейсы
      </v-btn>
    </template>
    <template #[`item.savedTotal.price`]="{ item }">
      {{ moneyFormatter(item.savedTotal.price) }}
    </template>
    <template #[`item.vatSum`]="{ item }">
      {{ moneyFormatter(item.savedTotal.price - item.savedTotal.priceWOVat) }}
    </template>
    <template #[`item.savedTotal.priceWOVat`]="{ item }">
      {{ moneyFormatter(item.savedTotal.priceWOVat) }}
    </template>
    <template #[`item.needUpdate`]="{ item }">
      <v-icon
        v-if="item.needUpdate"
        color="orange"
        :style="{ cursor: 'pointer' }"
        @click="updateItemPrice(item._id)"
      >
        mdi-alert
      </v-icon>
    </template>
  </v-data-table>
</template>
<script>
import store from '@/store'
import { computed, ref } from 'vue'
import { moneyFormatter } from '@/shared/utils'
import ALL_HEADERS from './headers.js'
export default {
  name: 'PaymentInvoiceOrdersList',
  props: {
    orders: {
      type: Array,
    },
  },
  setup(props, { emit }) {
    const selected = ref([])
    const selectedOrderIds = computed(() => selected.value.map((i) => i.rowId))

    const preparedOrders = computed(() => {
      if (!props.orders) return []
      return props.orders.map((item, idx) => ({
        idx: idx + 1,
        ...item,
        plannedDate: new Date(item.plannedDate).toLocaleDateString(),
        savedTotal: item.savedTotal
          ? item.savedTotal
          : { price: 0, priceWOVat: 0 },
      }))
    })

    function deleteHandler() {
      emit('delete', selectedOrderIds.value)
      selected.value = []
    }

    function dblclickRowHandler(_event, { item }) {
      if (!item.orderId) {
        store.commit(
          'setError',
          'Ссылка отсутствует! Необходимо удалить рейс из акта!'
        )
        return
      }
      emit('dblRowClick', item.orderId)
    }

    function updateItemPrice(itemId) {
      if (!itemId) {
        store.commit(
          'setError',
          'Ссылка отсутствует! Необходимо удалить рейс из акта!'
        )
        return
      }
      emit('updateItemPrice', itemId)
    }

    return {
      selected,
      selectedOrderIds,
      preparedOrders,
      headers: ALL_HEADERS,
      deleteHandler,
      dblclickRowHandler,
      updateItemPrice,
      moneyFormatter,
    }
  },
}
</script>
<style scoped></style>
