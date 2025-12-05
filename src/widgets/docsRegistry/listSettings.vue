<template>
  <div class="settings-wrapper">
    <AppTableColumnSetting
      :allHeaders="DOCS_REGISTRY_TABLE_HEADERS"
      listSettingsName="docsRegistrySettings"
      @change="updateHeadersHandler"
    />

    <v-autocomplete
      :modelValue="settings.clients"
      itemTitle="name"
      itemValue="_id"
      label="Клиенты"
     
      clearable
      multiple
      variant="outlined"
       density="compact"
      :items="clientItems"
      hideDetails
      :style="{ maxWidth: '400px' }"
      @update:model-value="updateSettings($event, 'clients')"
    />
    <v-select
      :modelValue="settings.status"
      label="Статус"
     
      clearable
      variant="outlined"
       density="compact"
      hideDetails
      :items="statusItems"
      :style="{ maxWidth: '300px' }"
      @update:model-value="updateSettings($event, 'status')"
    />
  </div>
</template>

<script>
import store from '@/store'
import { computed } from 'vue'
import { AppTableColumnSetting } from '@/shared/ui'
import { DOCS_REGISTRY_TABLE_HEADERS } from '@/shared/constants'

export default {
  name: 'DocsRegistryListSettingsWidget',
  components: { AppTableColumnSetting },
  model: {
    prop: 'settings',
    event: 'change',
  },
  props: {
    settings: Object,
  },

  setup(props, ctx) {
    const clientItems = computed(() => {
      return store.getters.partners.filter(i => i.isClient)
    })

    const statusItems = computed(() => {
      return store.getters.docsRegistryStatuses
    })

    function updateSettings(value, field) {
      ctx.emit('change', Object.assign({}, props.settings, { [field]: value }))
    }

    function updateHeadersHandler(val) {
      ctx.emit('updateHeaders', val)
    }
    return {
      clientItems,
      statusItems,
      updateHeadersHandler,
      updateSettings,
      DOCS_REGISTRY_TABLE_HEADERS,
    }
  },
}
</script>
<style scoped>
  .settings-wrapper {
    display: flex;
    flex-direction: row;
    padding: 10px;
    gap: 15px;
  }
</style>
