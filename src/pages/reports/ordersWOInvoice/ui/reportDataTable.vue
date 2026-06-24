<template>
  <v-data-table-server
    :items="preparedItems"
    :headers="headers"
    fixed-header
    :loading="loading"
    :items-length="statisticData.count"
    height="72vh"
    show-group-by
    :items-per-page-options="[50, 100, 300]"
    @update:options="updateListOptions"
    @dblclick:row="dblClickRow"
  >
    <template #[`footer.prepend`]>
      <ReportStatisticData :data="statisticData" class="mr-auto" />
    </template>
  </v-data-table-server>
</template>
<script setup>
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { DataTableRow } from './index'
import ReportStatisticData from './reportStatisticData.vue'

defineOptions({ name: 'ReportDataTable' })

const props = defineProps({
  items: Array,
  headers: Array,
  loading: Boolean,
  statisticData: Object,
  listOptions: Object,
})

const emit = defineEmits(['update:listOptions'])

const router = useRouter()

const preparedItems = computed(() => props.items.map((i) => new DataTableRow(i)))

function dblClickRow(_, { item }) {
  if (item) router.push(`/orders/${item.orderId}`)
}

function updateListOptions(val) {
  emit('update:listOptions', val)
}
</script>
<style scoped>
.v-data-table {
  white-space: nowrap;
}
</style>
