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
  >
    <template #[`item.createdAt`]="{ item }">
      {{ new Date(item.createdAt).toLocaleString() }}
    </template>
    <template #[`item.agreementsName`]="{ item }">
      <div v-for="(name, idx) in item.agreementsName" :key="idx + ' ' + name">
        {{ name }}
      </div>
    </template>

    <template #[`item.startDate`]="{ item }">
      {{ new Date(item.startDate).toLocaleDateString() }}
    </template>
    <template #[`item.endDate`]="{ item }">
      {{ item.endDate ? new Date(item.endDate).toLocaleDateString() : null }}
    </template>
  </v-data-table>
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
