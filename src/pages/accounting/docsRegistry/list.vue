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
      @updateHeaders="changeHeaders"
    />
    <docs-registry-data-table
      v-model="settings"
      :items="items"
      :headers="headers"
      :statisticData="statisticData"
      :listOptions.sync="settings.listOptions"
      :loading="loading"
    />
  </entity-list-wrapper>
</template>
<script>
import { ref } from 'vue'
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
    const { create, refresh, settings, items, loading, statisticData } =
      useListData()
    return {
      create,
      refresh,
      settings,
      items,
      headers,
      changeHeaders,
      statisticData,
      loading,
    }
  },
}
</script>
<style></style>
