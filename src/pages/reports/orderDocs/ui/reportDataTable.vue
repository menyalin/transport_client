<template>
  <v-data-table
    :items="preparedItems"
   
    :headers="headers"
    :loading="loading"
    :itemsPerPage="-1"
    height="72vh"
    showGroupBy
    fixedHeader
    :footerProps="{
      'items-per-page-options': [-1, 10],
    }"
    @dblclick:row="dblClickRow"
  >
    <template #[`item.orderDate`]="{ item }">
      {{ new Date(item.orderDate).toLocaleString() }}
    </template>
    <template #[`item.docsState.date`]="{ item }">
      {{ item.docsState.date ? new Date(item.docsState.date).toLocaleString() : null }}
    </template>
    <template #[`item.reviewDate`]="{ item }">
      {{ item.reviewDate ? new Date(item.reviewDate).toLocaleDateString() : null }}
    </template>
    <template #[`item._docsStatusObj.text`]="{ item }">
      <b :style="{ color: item._docsStatusObj.color }">{{ item._docsStatusObj.text }}</b>
    </template>
    <template #[`footer.prepend`]>
      <OrderListFooterDetails
        :total="statisticData.totalCount"
        :needFix="statisticData.correctionCount"
        :onCheck="statisticData.reviewCount"
        :missing="statisticData.notGettedCount"
      />
    </template>
  </v-data-table>
</template>

<script>
import { computed } from 'vue'
import router from '@/router'
import { OrderListFooterDetails } from '@/shared/ui'

export default {
  name: 'ReportDataTable',
  components: {
    OrderListFooterDetails,
  },
  props: {
    items: Array,
    headers: Array,
    loading: Boolean,
    statisticData: Object,
  },
  setup(props) {
    const preparedItems = computed(() => props.items.map(i => ({ ...i })))
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

<style scoped>
  .v-data-table {
    white-space: nowrap;
  }
</style>
