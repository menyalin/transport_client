<template>
  <v-data-table
    :items="preparedItems"
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
      <order-list-footer-details
        :total="statisticData.totalCount"
        :needFix="statisticData.correctionCount"
        :onCheck="statisticData.reviewCount"
        :missing="statisticData.notGettedCount"
      />
    </template>
  </v-data-table>
</template>
<script setup>
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { OrderListFooterDetails } from '@/shared/ui'

defineOptions({ name: 'ReportDataTable' })

const router = useRouter()

const props = defineProps({
  items: Array,
  headers: Array,
  loading: Boolean,
  statisticData: Object,
})

const preparedItems = computed(() => props.items.map((i) => ({ ...i })))

function dblClickRow(_, { item }) {
  if (item) router.push(`/orders/${item._id}`)
}
</script>
<style scoped>
.v-data-table {
  white-space: nowrap;
}
</style>
