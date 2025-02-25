<template>
  <v-data-table
    :headers="headers"
    checkbox-color="primary"
    v-model="selected"
    item-key="_id"
    :items="items"
    showSelect
    :loading="loading"
    height="70vh"
    dense
    :serverItemsLength="totalCount"
    fixed-header
    :footer-props="{
      'items-per-page-options': [50, 100, 200],
    }"
    :options="listOptions"
    @update:options="updateListOptionsHandler"
    @dblclick:row="dblClickRow"
  >
    <template #[`item.date`]="{ item }">
      {{ new Date(item.date).toLocaleDateString() }}
    </template>

    <template #[`item.plannedPayDate`]="{ item }">
      {{
        item.plannedPayDate
          ? new Date(item.plannedPayDate).toLocaleDateString()
          : null
      }}
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
  </v-data-table>
</template>

<script>
import { computed, watch } from 'vue'
import router from '@/router'
import { moneyFormatter } from '@/shared/utils'
import IncomingInvoiceListAnalytics from './listAnalytics.vue'
import { usePersistedRef } from '@/shared/hooks'
export default {
  name: 'PaymentInvoicesDataTable',
  components: {
    IncomingInvoiceListAnalytics,
  },
  model: {
    prop: 'settings',
    event: 'change',
  },
  props: {
    items: Array,
    totalCount: Number,
    listOptions: Object,
    analyticsData: Object,
    routesCount: {
      type: Number,
      default: 0,
    },
    total: Object,
    settings: Object,
    headers: Array,
    loading: Boolean,
  },
  setup(props, ctx) {
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
      router.push(`incomingInvoice/${item._id}`)
    }
    function updateListOptionsHandler(options) {
      ctx.emit('update:listOptions', { ...options })
    }

    watch(selected, (val) => {
      console.log(val)
    })

    return {
      selected,
      dblClickRow,
      updateListOptionsHandler,
      moneyFormatter,
      analytics,
    }
  },
}
</script>
