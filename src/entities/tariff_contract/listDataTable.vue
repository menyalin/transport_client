<template>
  <v-data-table-server
    :items="items"
    :items-length="count"
    :items-per-page="50"
    dense
    :headers="headers"
    :loading="loading"
    density="compact"
    item-value="_id"
    height="72vh"
    fixed-header
    :listOptions="listOptions"
    :footer-props="{
      'items-per-page-options': [50, 100, 300],
    }"
    @update:options="updateListOptions"
    @dblclick:row="dblClickRow"
  >
    <template #[`item.createdAt`]="{ item }">
      {{ new Date(item.createdAt).toLocaleString() }}
    </template>
    <template #[`item.startDate`]="{ item }">
      {{ new Date(item.startDate).toLocaleDateString() }}
    </template>
    <template #[`item.endDate`]="{ item }">
      {{ item.endDate ? new Date(item.endDate).toLocaleDateString() : null }}
    </template>
  </v-data-table-server>
</template>
<script lang="ts">
//@ts-nocheck
import { defineComponent } from 'vue'
import { useRouter } from 'vue-router'
import tableHeaders from './listDataTableHeaders'

export default defineComponent({
  name: 'TariffContractDataTable',
  props: {
    items: Array,
    loading: Boolean,
    listOptions: Object,
    count: Number,
  },
  setup(_props, ctx) {
    const router = useRouter()
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
})
</script>
