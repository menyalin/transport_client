<template>
  <v-data-table
    :items="preparedItems"
   
    :headers="headers"
    :loading="loading"
    :itemsLength="statisticData.count"
    height="72vh"
    showGroupBy
    fixedHeader
    :listOptions="listOptions"
    :footerProps="{
      'items-per-page-options': [50, 100, 300],
    }"
    @update:options="updateListOptions"
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
    const preparedItems = computed(() => props.items.map(i => new DataTableRow(i)))
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
