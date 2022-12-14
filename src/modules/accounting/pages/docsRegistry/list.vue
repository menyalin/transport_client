<template>
  <v-container fluid>
    <v-row>
      <v-col>
        <app-buttons-panel
          panel-type="list"
          :disabled-refresh="!$store.getters.directoriesProfile"
          :disabledSubmit="!$store.getters.hasPermission('docsRegistry:write')"
          @submit="create"
          @refresh="refresh"
        />
        <list-settings-widget
          v-model="settings"
          @changeHeaders="changeHeaders"
        />
      </v-col>
    </v-row>
  </v-container>
</template>
<script>
import AppButtonsPanel from '@/modules/common/components/buttonsPanel'
import AppTableColumnSettings from '@/modules/common/components/tableColumnSettings'
import { ListSettingsWidget, useListData } from '../../components/docsRegistry'

export default {
  name: 'DocsRegistryList',
  components: {
    AppButtonsPanel,
    AppTableColumnSettings,
    ListSettingsWidget,
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
