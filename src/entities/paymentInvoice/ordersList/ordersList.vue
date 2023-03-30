<template>
  <v-data-table
    :items="preparedOrders"
    :headers="headers"
    v-model="selected"
    multiple
    item-key="_id"
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
    <template #[`item.total.price`]="{ item }">
      {{ new Intl.NumberFormat().format(item.total.price) }}
    </template>
    <template #[`item.total.priceWOVat`]="{ item }">
      {{ new Intl.NumberFormat().format(item.total.priceWOVat) }}
    </template>
  </v-data-table>
</template>
<script>
import { computed, ref } from 'vue'
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
    const selectedOrderIds = computed(() => selected.value.map((i) => i._id))

    const preparedOrders = computed(() => {
      if (!props.orders) return []
      return props.orders.map((item, idx) => ({
        idx: idx + 1,
        ...item,
        plannedDate: new Date(item.plannedDate).toLocaleDateString(),
      }))
    })

    function deleteHandler() {
      emit('delete', selectedOrderIds.value)
      selected.value = []
    }

    function dblclickRowHandler(_event, { item }) {
      emit('dblRowClick', item.orderId)
    }

    return {
      selected,
      selectedOrderIds,
      preparedOrders,
      headers: ALL_HEADERS,
      deleteHandler,
      dblclickRowHandler,
    }
  },
}
</script>
<style scoped></style>
