<template>
  <entity-list-wrapper>
    <buttons-panel
      panel-type="list"
      :disabled-refresh="!$store.getters.directoriesProfile"
      :disabledSubmit="!$store.getters.hasPermission('docsRegistry:write')"
      @submit="create"
      @refresh="refresh"
    />
    <list-settings-widget v-model="settings" @changeHeaders="changeHeaders" />
    <docs-registry-data-table
      v-model="settings"
      :items="items"
      :headers="headers"
    />
  </entity-list-wrapper>
</template>
<script>
import AppTableColumnSettings from '@/modules/common/components/tableColumnSettings'
import {
  ListSettingsWidget,
  useListData,
  DocsRegistryDataTable,
} from '../../components/docsRegistry'
import { EntityListWrapper, ButtonsPanel } from '@/shared/ui'

export default {
  name: 'DocsRegistryList',
  components: {
    ButtonsPanel,
    AppTableColumnSettings,
    ListSettingsWidget,
    EntityListWrapper,
    DocsRegistryDataTable,
  },
  setup() {
    const { create, refresh, settings, changeHeaders, items, headers } =
      useListData()
    return {
      create,
      refresh,
      settings,
      changeHeaders,
      items,
      headers,
    }
  },
}
</script>
<style></style>
