<template>
  <v-data-table
    v-model="selected"
    :items="preparedOrders"
    :headers="headers"
    multiple
    itemKey="_id"
    checkboxColor="primary"
    :showSelect="!disabled"
    :itemsPerPage="-1"
    :footerProps="{
      itemsPerPageOptions: [-1, 100],
    }"
   
    @dblclick:row="dblclickRowHandler"
  >
    <template #top>
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
      <v-icon v-if="item.needUpdate" color="orange" :style="{ cursor: 'pointer' }"
@click="updateItemPrice(item._id)">
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
    disabled: Boolean,
    orders: {
      type: Array,
    },
  },
  setup(props, { emit }) {
    const selected = ref([])
    const selectedOrderIds = computed(() => selected.value.map(i => i.rowId))
    const expanded = ref([])
    const preparedOrders = computed(() => {
      if (!props.orders) return []
      return props.orders.map((item, idx) => ({
        idx: idx + 1,
        ...item,
        plannedDate: new Date(item.plannedDate).toLocaleDateString(),
        savedTotal: item.savedTotal ? item.savedTotal : { price: 0, priceWOVat: 0 },
        hasDiffPrice: item.loaderData?.price && item.loaderData?.price !== item.savedTotal?.price,
        hasDiffPriceWOVat: item.loaderData?.priceWOVat && item.loaderData?.priceWOVat !== item.savedTotal?.priceWOVat,
        loadedPrice: item.loaderData?.price || 0,
        loadedPriceWOVat: item.loaderData?.priceWOVat || 0,
      }))
    })

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

    return {
      selected,
      selectedOrderIds,
      preparedOrders,
      headers,
      deleteHandler,
      dblclickRowHandler,
      updateItemPrice,
      moneyFormatter,
      expanded,
    }
  },
}
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
