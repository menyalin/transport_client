<template>
  <v-data-table
    :items="preparedItems"
    dense
    :headers="headers"
    :loading="loading"
    :items-per-page="-1"
    height="72vh"
    show-group-by
    fixed-header
    :footer-props="{
      'items-per-page-options': [-1, 10],
    }"
    @dblclick:row="dblClickRow"
  >
    <template #[`item.orderDate`]="{ item }">
      {{ new Date(item.orderDate).toLocaleString() }}
    </template>
    <template #[`item._docsStatusObj.text`]="{ item }">
      <b :style="{ color: item._docsStatusObj.color }">{{
        item._docsStatusObj.text
      }}</b>
    </template>
  </v-data-table>
</template>

<script>
import router from '@/router'
import { computed } from 'vue'

export default {
  name: 'ReportDataTable',
  props: {
    items: Array,
    headers: Array,
    loading: Boolean,
  },
  setup(props) {
    const preparedItems = computed(() => props.items.map((i) => ({ ...i })))
    function dblClickRow(_, { item }) {
      if (item) router.push(`/orders/${item._id}`)
    }
    return {
      preparedItems,
      dblClickRow,
    }
  },
}
</script>

<style></style>
