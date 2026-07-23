<template>
  <v-data-table-server
    :items="items"
    :headers="headers"
    :loading="loading"
    :items-length="count"
    height="72vh"
    fixed-header
    :items-per-page-options="[50, 100, 300]"
    v-model:options="options"
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
  </v-data-table-server>
</template>

<script setup>
import { useRouter } from 'vue-router'
import tableHeaders from './listDataTableHeaders'

defineOptions({ name: 'TariffContractDataTable' })

defineProps({
  items: Array,
  loading: Boolean,
  count: Number,
})

const options = defineModel('options', {
  type: Object,
  default: () => ({
    page: 1,
    itemsPerPage: 50,
    sortBy: [],
    sortDesc: [],
  }),
})

const router = useRouter()
const headers = tableHeaders

function dblClickRow(_, { item }) {
  if (item) router.push(`/accounting/tariff_contracts/${item._id}`)
}
</script>
