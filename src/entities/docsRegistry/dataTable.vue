<template>
  <v-data-table-server
    :headers="headers"
    :items="items"
    :loading="loading"
    height="70vh"
    fixed-header
    :page="options.page"
    :items-per-page="options.itemsPerPage"
    :items-length="totalCount"
    @dblclick:row="dblClickRow"
    @update:options="optionsUpdateHandler"
  >
    <template #[`item.createdAt`]="{ item }">
      {{ new Date(item.createdAt).toLocaleString() }}
    </template>
    <template #[`item.note`]="{ item }">
      <span class="d-inline-block text-truncate" style="max-width: 200px">
        {{ item.note }}
      </span>
    </template>
  </v-data-table-server>
</template>

<script setup>
import { useRouter } from 'vue-router'

const router = useRouter()

defineOptions({
  name: 'DocsRegistryDataTable',
})
const options = defineModel('options')
const emits = defineEmits(['update:options'])
defineProps({
  items: Array,
  headers: Array,
  totalCount: Number,
  loading: Boolean,
})

function optionsUpdateHandler(val) {
  emits('update:options', val)
}
function dblClickRow(_event, { item }) {
  router.push(`docsRegistry/${item._id}`)
}
</script>
