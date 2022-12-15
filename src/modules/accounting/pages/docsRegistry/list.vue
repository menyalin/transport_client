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
  </entity-list-wrapper>
</template>
<script>
import AppTableColumnSettings from '@/modules/common/components/tableColumnSettings'
import { ListSettingsWidget, useListData } from '../../components/docsRegistry'
import { EntityListWrapper, ButtonsPanel } from '@/shared/ui'

export default {
  name: 'DocsRegistryList',
  components: {
    ButtonsPanel,
    AppTableColumnSettings,
    ListSettingsWidget,
    EntityListWrapper,
  },
  setup() {
    const { create, refresh, settings, changeHeaders } = useListData()
    return {
      create,
      refresh,
      settings,
      changeHeaders,
    }
  },
}
</script>
<style></style>
