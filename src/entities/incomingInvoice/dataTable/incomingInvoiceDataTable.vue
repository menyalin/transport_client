<template>
  <v-data-table
    :headers="headers"
    checkbox-color="primary"
    item-key="_id"
    :items="items"
    :loading="loading"
    height="70vh"
    dense
    :server-items-length="totalCount"
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
      {{ moneyFormatter(item.priceWOVat) }}
    </template>

    <template #[`item.priceWithVat`]="{ item }">
      {{ moneyFormatter(item.priceWithVat) }}
    </template>

    <template #[`item.note`]="{ item }">
      <span class="d-inline-block text-truncate" style="max-width: 200px">
        {{ item.note }}
      </span>
    </template>
    <template #[`footer.prepend`] />
  </v-data-table>
</template>

<script>
import router from '@/router'
import { moneyFormatter } from '@/shared/utils'
export default {
  name: 'PaymentInvoicesDataTable',

  model: {
    prop: 'settings',
    event: 'change',
  },
  props: {
    items: Array,
    totalCount: Number,
    listOptions: Object,
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
    function dblClickRow(_event, { item }) {
      router.push(`incomingInvoice/${item._id}`)
    }
    function updateListOptionsHandler(options) {
      ctx.emit('update:listOptions', { ...options })
    }

    return {
      dblClickRow,
      updateListOptionsHandler,
      moneyFormatter,
    }
  },
}
</script>
