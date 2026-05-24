<template>
  <entity-list-wrapper>
    <buttons-panel
      panel-type="list"
      :disabled-refresh="!$store.getters.directoriesProfile"
      :disabledSubmit="!$store.getters.hasPermission('docsRegistry:write')"
      @submit="create"
      @refresh="refresh"
    />
    <docs-registry-list-settings v-model:settings="settings" @update:headers="changeHeaders" />

    <docs-registry-data-table
      :items="items"
      :headers="headers"
      :totalCount="totalCount"
      v-model:options="listOptions"
      :loading="loading"
      @update:options="updateListOptionsHandler"
    />
  </entity-list-wrapper>
</template>
<script setup>
import { ref, onBeforeUnmount } from 'vue'
import socket from '@/socket'
import { DocsRegistryListSettings, DocsRegistryDataTable } from '@/entities/docsRegistry'
import { useListData } from './model/useListData.js'
import { EntityListWrapper, ButtonsPanel } from '@/shared/ui'

defineOptions({
  name: 'DocsRegistryList',
})

const headers = ref([])
function changeHeaders(val) {
  headers.value = val
}
const {
  create,
  refresh,
  settings,
  listOptions,
  items,
  totalCount,
  loading,
  updateListOptionsHandler,
  onDeleteHandler,
} = useListData()

socket.on('docsRegistry:deleted', onDeleteHandler)
onBeforeUnmount(() => {
  socket.off('docsRegistry:deleted', onDeleteHandler)
})
</script>
<style></style>
