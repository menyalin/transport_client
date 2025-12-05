<template>
  <EntityListWrapper>
    <ButtonsPanel
      panelType="list"
      :disabledRefresh="!$store.getters.directoriesProfile"
      :disabledSubmit="!$store.getters.hasPermission('docsRegistry:write')"
      @submit="create"
      @refresh="refresh"
    />
    <DocsRegistryListSettings v-model="settings" @updateHeaders="changeHeaders" />
    <DocsRegistryDataTable
      v-model="settings"
      v-model:listOptions="settings.listOptions"
      :items="items"
      :headers="headers"
      :totalCount="totalCount"
      :statisticData="statisticData"
      :loading="loading"
    />
  </EntityListWrapper>
</template>
<script>
import { ref, onBeforeUnmount } from 'vue'
import socket from '@/socket'
import { DocsRegistryListSettings, DocsRegistryDataTable } from '@/widgets/docsRegistry'
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
    const { create, refresh, settings, items, totalCount, loading, statisticData, onDeleteHandler } = useListData()

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
