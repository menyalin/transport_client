<template>
  <EntityListWrapper>
    <ButtonsPanel
      panel-type="list"
      :disabled-refresh="!store.getters.directoriesProfile"
      :disabled-submit="!store.getters.hasPermission('docsRegistry:write')"
      @submit="create"
      @refresh="refresh"
    />
    <DocsRegistryListSettings v-model:settings="settings" @update:headers="changeHeaders" />

    <DocsRegistryDataTable
      :items="items"
      :headers="headers"
      :totalCount="totalCount"
      v-model:options="listOptions"
      :loading="loading"
    />
  </EntityListWrapper>
</template>
<script setup>
import { ref, onBeforeUnmount } from 'vue'
import { useStore } from 'vuex'
import socket from '@/socket'
import { DocsRegistryListSettings, DocsRegistryDataTable } from '@/entities/docsRegistry'
import { useListData } from './model/useListData.js'
import { EntityListWrapper, ButtonsPanel } from '@/shared/ui'

defineOptions({
  name: 'DocsRegistryList',
})

const store = useStore()

const headers = ref([])
function changeHeaders(val) {
  headers.value = val
}
const { create, refresh, settings, listOptions, items, totalCount, loading, onDeleteHandler } =
  useListData()

socket.on('docsRegistry:deleted', onDeleteHandler)
onBeforeUnmount(() => {
  socket.off('docsRegistry:deleted', onDeleteHandler)
})
</script>
<style></style>
