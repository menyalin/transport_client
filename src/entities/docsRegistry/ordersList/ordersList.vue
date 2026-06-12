<script setup>
import { computed, ref } from 'vue'
import ALL_HEADERS from './headers.js'
defineOptions({
  name: 'DocsRegistryOrdersList',
})

const props = defineProps({
  orders: {
    type: Array,
    default: () => [],
  },
})
const emits = defineEmits(['delete', 'dblRowClick'])
const selected = ref([])

const preparedOrders = computed(() => {
  if (!props.orders) return []
  return props.orders.map((item, idx) => ({
    idx: idx + 1,
    ...item,
    orderDate: new Date(item.orderDate).toLocaleDateString(),
  }))
})

function deleteHandler() {
  const res = confirm('Вы уверены?')
  if (res) {
    emits('delete', selected.value)
    selected.value = []
  }
}

function dblclickRowHandler(_event, { item }) {
  emits('dblRowClick', item.order._id)
}
</script>

<template>
  <v-data-table
    :items="preparedOrders"
    :headers="ALL_HEADERS"
    v-model="selected"
    multiple
    show-select
    item-value="order._id"
    :itemsPerPage="-1"
    @dblclick:row="dblclickRowHandler"
  >
    <template v-slot:top>
      <div>
        <v-btn v-if="selected.length > 0" color="warning" @click="deleteHandler" class="ma-3">
          Удалить выделенные рейсы
        </v-btn>
      </div>
    </template>
  </v-data-table>
</template>

<style scoped></style>
