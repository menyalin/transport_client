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
    <!-- <template #[`item.plannedDate`]="{ item }">
      {{ new Date(item.plannedDate).toLocaleString() }}
    </template> -->
    <!-- <template #[`item.docsState.date`]="{ item }">
      {{
        item.docsState.date
          ? new Date(item.docsState.date).toLocaleString()
          : null
      }}
    </template> -->
    <!-- <template #[`item.reviewDate`]="{ item }">
      {{
        item.reviewDate ? new Date(item.reviewDate).toLocaleDateString() : null
      }}
    </template> -->
    <!-- <template #[`item._docsStatusObj.text`]="{ item }">
      <b :style="{ color: item._docsStatusObj.color }">{{
        item._docsStatusObj.text
      }}</b>
    </template> -->
    <!-- <template #footer.prepend>
      <order-list-footer-details
        :total="statisticData.totalCount"
        :needFix="statisticData.correctionCount"
        :onCheck="statisticData.reviewCount"
        :missing="statisticData.notGettedCount"
      />
    </template> -->
  </v-data-table>
</template>

<script>
import { computed } from 'vue'
import router from '@/router'
import { OrderListFooterDetails } from '@/shared/ui'
import { DataTableRow } from './index'

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
