<template>
  <v-data-table-server
    :items="preparedOrders"
    :headers="headers"
    v-model="selected"
    item-value="_id"
    :loading="loading"
    checkbox-color="primary"
    :show-select="!disabled"
    :items-length="ordersTotalCount"
    :items-per-page-options="[25, 50, 100]"
    v-model:options="options"
    @dblclick:row="dblclickRowHandler"
  >
    <template v-slot:top>
      <v-btn
        v-if="!disabled"
        :disabled="!selectedOrderIds.length"
        size="small"
        variant="text"
        color="error"
        @click="deleteHandler"
      >
        Удалить выделенные рейсы
      </v-btn>
    </template>

    <template #[`item.savedTotal.price`]="{ item }">
      <div v-if="item.hasDiffPrice" class="diff-cell">
        <div>Рейс: {{ moneyFormatter(item.savedTotal.price) }}</div>
        <div>Реестр: {{ moneyFormatter(item.loadedPrice) }}</div>
      </div>
      <span v-else>{{ moneyFormatter(item.savedTotal.price) }}</span>
    </template>

    <template #[`item.vatSum`]="{ item }">
      {{ moneyFormatter(item.savedTotal.price - item.savedTotal.priceWOVat) }}
    </template>

    <template #[`item.savedTotal.priceWOVat`]="{ item }">
      <div v-if="item.hasDiffPriceWOVat" class="diff-cell">
        <div>Рейс: {{ moneyFormatter(item.savedTotal.priceWOVat) }}</div>
        <div>Реестр: {{ moneyFormatter(item.loadedPriceWOVat) }}</div>
      </div>
      <span v-else>{{ moneyFormatter(item.savedTotal.priceWOVat) }}</span>
    </template>

    <template #[`item.needUpdate`]="{ item }">
      <v-icon
        v-if="item && item.needUpdate"
        color="orange"
        :style="{ cursor: 'pointer' }"
        @click="updateItemPrice(item._id)"
      >
        mdi-alert
      </v-icon>
    </template>
  </v-data-table-server>
</template>

<script setup>
import { computed, ref, watch } from 'vue'
import { useStore } from 'vuex'
import { moneyFormatter } from '@/shared/utils'
import ALL_HEADERS from './headers.js'

defineOptions({ name: 'PaymentInvoiceOrdersList' })

const props = defineProps({
  disabled: Boolean,
  loading: Boolean,
  ordersTotalCount: { type: Number, default: 0 },
  orders: {
    type: Array,
    default: () => [],
  },
})

const emit = defineEmits(['delete', 'dblRowClick', 'updateItemPrice'])

const options = defineModel('options', {
  type: Object,
  default: () => ({
    page: 1,
    itemsPerPage: 25,
    sortBy: [],
    sortDesc: [],
  }),
})

const store = useStore()

const selected = ref([])
const selectedOrderIds = computed(() => selected.value)
const preparedOrders = ref([])

function prepareItem(item, idx) {
  const page = options.value?.page || 1
  const itemsPerPage = options.value?.itemsPerPage || 25
  return {
    idx: idx + 1 + (page - 1) * itemsPerPage,
    ...item,
    plannedDate: new Date(item.plannedDate).toLocaleDateString(),
    savedTotal: item.savedTotal ? item.savedTotal : { price: 0, priceWOVat: 0 },
    hasDiffPrice: item.loaderData?.price && item.loaderData?.price !== item.savedTotal?.price,
    hasDiffPriceWOVat:
      item.loaderData?.priceWOVat && item.loaderData?.priceWOVat !== item.savedTotal?.priceWOVat,
    loadedPrice: item.loaderData?.price || 0,
    loadedPriceWOVat: item.loaderData?.priceWOVat || 0,
  }
}

function deleteHandler() {
  emit('delete', selectedOrderIds.value)
  selected.value = []
}

function dblclickRowHandler(_event, { item }) {
  if (!item.orderId) {
    store.commit('setError', 'Ссылка отсутствует! Необходимо удалить рейс из акта!')
    return
  }
  emit('dblRowClick', item.orderId)
}

function updateItemPrice(itemId) {
  if (!itemId) {
    store.commit('setError', 'Ссылка отсутствует! Необходимо удалить рейс из акта!')
    return
  }
  emit('updateItemPrice', itemId)
}

const headers = computed(() => ALL_HEADERS)

watch(
  () => props.orders,
  (val) => {
    preparedOrders.value = [...val.map((item, idx) => prepareItem(item, idx))]
  },
  { deep: true }
)
</script>

<style scoped>
.diff-cell {
  border: 1px solid rgb(255, 97, 97);
  background-color: rgba(255, 97, 97, 0.2);
  border-radius: 5px;
  margin: 1px 2px;
  padding: 0px 2px;
}
</style>
