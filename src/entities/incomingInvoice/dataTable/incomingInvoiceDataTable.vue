<template>
  <v-data-table-server
    :headers="headers"
    checkbox-color="primary"
    v-model="selected"
    item-value="_id"
    :items="items"
    show-select
    :loading="loading"
    height="70vh"
    :items-length="totalCount"
    fixed-header
    :items-per-page-options="[50, 100, 200]"
    v-model:options="options"
    @update:model-value="onSelectedChange"
    @dblclick:row="dblClickRow"
  >
    <template #[`item.date`]="{ item }">
      {{ new Date(item.date).toLocaleDateString() }}
    </template>

    <template #[`item.payDate`]="{ item }">
      {{ item.payDate ? new Date(item.payDate).toLocaleDateString() : null }}
    </template>

    <template #[`item.receiptDate`]="{ item }">
      {{ item.receiptDate ? new Date(item.receiptDate).toLocaleDateString() : null }}
    </template>

    <template #[`item.plannedPayDate`]="{ item }">
      {{ item.plannedPayDate ? new Date(item.plannedPayDate).toLocaleDateString() : null }}
    </template>

    <template #[`item.priceWOVat`]="{ item }">
      {{ moneyFormatter(item.priceWOVat, 2) }}
    </template>

    <template #[`item.priceWithVat`]="{ item }">
      {{ moneyFormatter(item.priceWithVat, 2) }}
    </template>

    <template #[`item.note`]="{ item }">
      <span class="d-inline-block text-truncate" style="max-width: 200px">
        {{ item.note }}
      </span>
    </template>

    <template #[`footer.prepend`]>
      <IncomingInvoiceListAnalytics :data="analytics" />
    </template>
  </v-data-table-server>
</template>

<script setup>
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { moneyFormatter } from '@/shared/utils'
import IncomingInvoiceListAnalytics from './listAnalytics.vue'
import { usePersistedRef } from '@/shared/hooks'

defineOptions({ name: 'PaymentInvoicesDataTable' })

defineModel({ type: Object })

const props = defineProps({
  items: Array,
  totalCount: Number,
  analyticsData: Object,
  routesCount: {
    type: Number,
    default: 0,
  },
  total: Object,
  headers: Array,
  loading: Boolean,
})

const options = defineModel('options', {
  type: Object,
  default: () => ({}),
})

const router = useRouter()

const selected = usePersistedRef([], 'selectedInvoicesInList')

const analytics = computed(() => {
  if (selected.value.length)
    return selected.value.reduce(
      (res, item) => ({
        count: res.count + 1,
        routesCount: res.routesCount + item.ordersCount,
        totalSumWOVat: res.totalSumWOVat + item.priceWOVat,
        totalSum: res.totalSum + item.priceWithVat,
      }),
      { count: 0, routesCount: 0, totalSumWOVat: 0, totalSum: 0 }
    )
  else return props.analyticsData
})

function dblClickRow(_event, { item }) {
  router.push({ name: 'IncomingInvoiceDetail', params: { id: item._id } })
}

function onSelectedChange(value) {
  selected.value = value
}
</script>
