<template>
  <div class="settings-wrapper">
    <app-table-column-setting
      :allHeaders="allHeaders"
      :listSettingsName="listSettingsName"
      @change="updateActiveHeaders"
    />

    <v-autocomplete
      :value="settings.clients"
      item-text="name"
      item-value="_id"
      label="Клиенты"
      dense
      clearable
      multiple
      outlined
      :items="clientItems"
      hide-details
      :style="{ maxWidth: '400px' }"
      @change="updateSettings($event, 'clients')"
    />
    <v-select
      :value="settings.status"
      label="Статус"
      dense
      clearable
      outlined
      hide-details
      :items="statusItems"
      :style="{ maxWidth: '300px' }"
      @change="updateSettings($event, 'status')"
    />
  </div>
</template>

<script>
import store from '@/store'
import { computed } from 'vue'
import { ALL_HEADERS } from '../model/tableHeaders'
import { AppTableColumnSetting } from '@/shared/ui'
export default {
  name: 'ListSettingsWidget',
  components: { AppTableColumnSetting },
  model: {
    prop: 'settings',
    event: 'change',
  },
  props: {
    settings: Object,
  },

  setup(props, ctx) {
    const allHeaders = ALL_HEADERS
    const listSettingsName = 'docsRegistrySettings'

    const clientItems = computed(() => {
      return store.getters.partners.filter((i) => i.isClient)
    })

    const statusItems = computed(() => {
      return store.getters.docsRegistryStatuses
    })

    function updateActiveHeaders(value) {
      ctx.emit('changeHeaders', value)
    }

    function updateSettings(value, field) {
      ctx.emit('change', Object.assign({}, props.settings, { [field]: value }))
    }

    return {
      allHeaders,
      clientItems,
      statusItems,
      listSettingsName,
      updateActiveHeaders,
      updateSettings,
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
