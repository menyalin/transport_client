<template>
  <v-data-table-server
    :headers="headers"
    :items="items"
    :loading="loading"
    height="70vh"
    fixed-header
    :items-per-page-options="[50, 100, 200]"
    v-model:options="settings.listOptions"
    :items-length="totalCount"
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
import router from '@/router'

const settings = defineModel({ type: Object })

defineProps({
  items: Array,
  totalCount: Number,
  headers: Array,
  loading: Boolean,
})

function dblClickRow(_event, { item }) {
  router.push(`docsRegistry/${item._id}`)
}
</script>
