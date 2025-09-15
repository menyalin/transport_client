<template>
  <v-data-table-server
    v-model="selected"
    v-model:options="listOptionsUpdateHandler"
    :headers="headers"
    :items="preparedItems"
    :loading="loading"
    density="compact"
    item-key="_id"
    show-select
    checkbox-color="primary"
    :serverItemsLength="total.count"
    :itemPerPage="50"
    :footer-props="{
      'items-per-page-options': [25, 50, 100],
    }"
    @dblclick:row="dblClickRow"
  >
    <template #[`top`]>
      <v-alert v-if="total.count > 0" density="compact" variant="outlined">
        <div>Всего рейсов: {{ total.count }}</div>
        <div>Сумма с НДС: {{ formattedSum.withVat }}</div>
        <div>Сумма без НДС: {{ formattedSum.woVat }}</div>
      </v-alert>
      <v-btn
        :disabled="selected.length === 0 || !allowDeleteOrders"
        color="error"
        size="small"
        class="ma-2"
        @click="removeOrdersHandler"
      >
        Удалить выбранные рейсы
      </v-btn>
    </template>
  </v-data-table-server>
</template>
<script>
import { computed } from 'vue'
import { moneyFormatter } from '@/shared/utils'
import { useTable } from './useTable'

export default {
  name: 'IncomingInvoiceFormOrdersTable',
  props: {
    invoiceId: String,
    allowDeleteOrders: { type: Boolean, default: true },
  },
  setup(props, ctx) {
    const {
      items,
      total,
      loading,
      headers,
      dblClickRow,
      listOptions,
      selected,
      removeOrdersHandler,
    } = useTable(props, ctx)

    const preparedItems = computed(() =>
      items.value.map((i, idx) => ({ ...i, idx: idx + 1 }))
    )

    const formattedSum = computed(() => {
      return {
        withVat: moneyFormatter(total.value.withVat),
        woVat: moneyFormatter(total.value.woVat),
      }
    })

    return {
      preparedItems,
      total,
      loading,
      headers,
      formattedSum,
      listOptions,
      selected,
      dblClickRow,
      removeOrdersHandler,
    }
  },
}
</script>
<style scoped></style>
