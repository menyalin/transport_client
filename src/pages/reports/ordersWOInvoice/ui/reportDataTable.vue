<template>
  <v-data-table
    :items="preparedItems"
    dense
    :headers="headers"
    :loading="loading"
    :serverItemsLength="statisticData.count"
    height="72vh"
    show-group-by
    fixed-header
    :listOptions="listOptions"
    @update:options="updateListOptions"
    :footer-props="{
      'items-per-page-options': [50, 100, 300],
    }"
    @dblclick:row="dblClickRow"
  >
    <template #[`footer.prepend`]>
      <ReportStatisticData :data="statisticData" />
    </template>
  </v-data-table>
</template>

<script>
import { computed } from 'vue'
import router from '@/router'
import { DataTableRow } from './index'
import ReportStatisticData from './reportStatisticData.vue'

export default {
  name: 'ReportDataTable',
  components: {
    ReportStatisticData,
  },
  props: {
    items: Array,
    headers: Array,
    loading: Boolean,
    statisticData: Object,
    listOptions: Object,
  },
  setup(props, ctx) {
    const preparedItems = computed(() =>
      props.items.map((i) => new DataTableRow(i))
    )
    function dblClickRow(_, { item }) {
      if (item) router.push(`/orders/${item.orderId}`)
    }
    function updateListOptions(val) {
      ctx.emit('update:listOptions', val)
    }
    return {
      preparedItems,
      dblClickRow,
      updateListOptions,
    }
  },
}
</script>

<style scoped>
.v-data-table {
  white-space: nowrap;
}
</style>
