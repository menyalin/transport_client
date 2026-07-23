<template>
  <v-data-table-server
    v-model="selected"
    :headers="headers"
    :items="preparedItems"
    :loading="loading"
    item-value="_id"
    show-select
    checkbox-color="primary"
    @dblclick:row="dblClickRow"
    :items-length="total.count"
    :items-per-page="50"
    :items-per-page-options="[25, 50, 100]"
    v-model:options="listOptions"
  >
    <template #[`top`]>
      <v-alert v-if="total.count > 0">
        <div>Всего рейсов: {{ total.count }}</div>
        <div>Сумма с НДС: {{ formattedSum.withVat }}</div>
        <div>Сумма без НДС: {{ formattedSum.woVat }}</div>
      </v-alert>
      <v-btn
        :disabled="selected.length === 0 || !allowDeleteOrders"
        color="error"
        @click="removeOrdersHandler"
        size="small"
        class="ma-2"
      >
        Удалить выбранные рейсы
      </v-btn>
    </template>
  </v-data-table-server>
</template>

<script setup>
import { computed } from 'vue'
import { moneyFormatter } from '@/shared/utils'
import { useTable } from './useTable'

defineOptions({ name: 'IncomingInvoiceFormOrdersTable' })

const props = defineProps({
  invoiceId: String,
  allowDeleteOrders: { type: Boolean, default: true },
})

const { items, total, loading, headers, dblClickRow, listOptions, selected, removeOrdersHandler } =
  useTable(props)

const preparedItems = computed(() => items.value.map((i, idx) => ({ ...i, idx: idx + 1 })))

const formattedSum = computed(() => ({
  withVat: moneyFormatter(total.value.withVat),
  woVat: moneyFormatter(total.value.woVat),
}))
</script>

<style scoped></style>
