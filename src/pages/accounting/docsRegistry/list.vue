<template>
  <entity-list-wrapper>
    <buttons-panel
      panel-type="list"
      :disabled-refresh="!$store.getters.directoriesProfile"
      :disabledSubmit="!$store.getters.hasPermission('docsRegistry:write')"
      @submit="create"
      @refresh="refresh"
    />
    <docs-registry-list-settings
      v-model="settings"
      @update-headers="changeHeaders"
    />
    <docs-registry-data-table
      v-model="settings"
      v-model:listOptions="settings.listOptions"
      :items="items"
      :headers="headers"
      :totalCount="totalCount"
      :statisticData="statisticData"
      :loading="loading"
    />
  </entity-list-wrapper>
</template>
<script>
import { ref, onBeforeUnmount } from 'vue'
import socket from '@/socket'
import {
  DocsRegistryListSettings,
  DocsRegistryDataTable,
} from '@/widgets/docsRegistry'
import { useListData } from './model/useListData.js'
import { EntityListWrapper, ButtonsPanel } from '@/shared/ui'

export default {
  name: 'DocsRegistryList',
  components: {
    ButtonsPanel,
    DocsRegistryListSettings,
    EntityListWrapper,
    DocsRegistryDataTable,
  },
  setup() {
    const headers = ref([])
    function changeHeaders(val) {
      headers.value = val
    }
    const {
      create,
      refresh,
      settings,
      items,
      totalCount,
      loading,
      statisticData,
      onDeleteHandler,
    } = useListData()

    socket.on('docsRegistry:deleted', onDeleteHandler)
    onBeforeUnmount(() => {
      socket.off('docsRegistry:deleted', onDeleteHandler)
    })

    return {
      create,
      refresh,
      settings,
      items,
      headers,
      changeHeaders,
      statisticData,
      loading,
      totalCount,
    }
  },
}
</script>
<style></style>
