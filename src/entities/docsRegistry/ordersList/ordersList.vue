<template>
  <v-data-table
    :items="preparedOrders"
    :headers="headers"
    v-model="selected"
    multiple
    item-key="order._id"
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
  </v-data-table>
</template>
<script>
import { computed, ref } from 'vue'
import ALL_HEADERS from './headers.js'
export default {
  name: 'DocsRegistryOrdersList',
  props: {
    orders: {
      type: Array,
    },
  },
  setup(props, { emit }) {
    const selected = ref([])
    const selectedOrderIds = computed(() =>
      selected.value.map((i) => i.order._id)
    )

    const preparedOrders = computed(() => {
      if (!props.orders) return []
      return props.orders.map((item, idx) => ({
        idx: idx + 1,
        ...item,
        orderDate: new Date(item.orderDate).toLocaleDateString(),
      }))
    })

    function deleteHandler() {
      emit('delete', selectedOrderIds.value)
      selected.value = []
    }

    function dblclickRowHandler(_event, { item }) {
      emit('dblRowClick', item.order._id)
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
