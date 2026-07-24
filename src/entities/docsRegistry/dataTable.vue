<template>
  <v-data-table-server
    :headers="headers"
    :items="items"
    :loading="loading"
    height="70vh"
    fixed-header
    :items-length="totalCount"
    v-model:options="options"
    @dblclick:row="dblClickRow"
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

defineOptions({ name: 'DocsRegistryDataTable' })

const router = useRouter()

const options = defineModel('options', {
  type: Object,
  default: () => ({ page: 1, itemsPerPage: 25 }),
})

defineProps({
  items: Array,
  headers: Array,
  totalCount: Number,
  loading: Boolean,
})

function dblClickRow(_event, { item }) {
  router.push(`docsRegistry/${item._id}`)
}
</script>
