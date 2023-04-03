<template>
  <v-data-table
    :headers="headers"
    :items="items"
    :loading="loading"
    height="70vh"
    dense
    :server-items-length="totalCount"
    fixed-header
    :footer-props="{
      'items-per-page-options': [50, 100, 200],
    }"
    :options="settings.listOptions"
    @update:options="updateListOptionsHandler"
    @dblclick:row="dblClickRow"
  >
    <template #[`item.createdAt`]="{ item }">
      {{ new Date(item.createdAt).toLocaleString() }}
    </template>

    <template #[`item.total.priceWOVat`]="{ item }">
      {{ new Intl.NumberFormat().format(item.total.priceWOVat) }}
    </template>

    <template #[`item.total.price`]="{ item }">
      {{ new Intl.NumberFormat().format(item.total.price) }}
    </template>

    <template #[`item.note`]="{ item }">
      <span class="d-inline-block text-truncate" style="max-width: 200px">
        {{ item.note }}
      </span>
    </template>
  </v-data-table>
</template>

<script>
import { ref } from 'vue'
import router from '@/router'

export default {
  name: 'PaymentInvoicesDataTable',
  model: {
    prop: 'settings',
    event: 'change',
  },
  props: {
    items: Array,
    totalCount: Number,
    settings: Object,
    headers: Array,
    loading: Boolean,
  },
  setup(props, ctx) {
    const listOptions = ref(props.settings?.listOptions || {})

    function dblClickRow(_event, { item }) {
      router.push(`paymentInvoice/${item._id}`)
    }
    function updateListOptionsHandler(options) {
      ctx.emit('update:listOptions', { ...options })
    }

    return {
      dblClickRow,
      listOptions,
      updateListOptionsHandler,
    }
  },
}
</script>
