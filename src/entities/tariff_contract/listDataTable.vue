<template>
  <v-data-table
    :items="items"
    dense
    :headers="headers"
    :loading="loading"
    :serverItemsLength="count"
    height="72vh"
    fixed-header
    :listOptions="listOptions"
    @update:options="updateListOptions"
    :footer-props="{
      'items-per-page-options': [50, 100, 300],
    }"
    @dblclick:row="dblClickRow"
  />
</template>
<script>
import tableHeaders from './listDataTableHeaders'
import router from '@/router'

export default {
  name: 'TariffContractDataTable',
  props: {
    items: Array,
    headers: Array,
    loading: Boolean,
    listOptions: Object,
    count: Number,
  },
  setup(_props, ctx) {
    function updateListOptions(val) {
      ctx.emit('update:listOptions', val)
    }
    function dblClickRow(_, { item }) {
      if (item) router.push(`/accounting/tariff_contracts/${item._id}`)
    }
    return {
      updateListOptions,
      dblClickRow,
      headers: tableHeaders,
    }
  },
}
</script>
