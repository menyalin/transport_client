<template>
  <div class="settings-wrapper">
    <app-table-column-setting
      :allHeaders="DOCS_REGISTRY_TABLE_HEADERS"
      listSettingsName="docsRegistrySettings"
      @change="updateHeadersHandler"
    />

    <v-autocomplete
      :model-value="settings.clients"
      item-title="name"
      item-value="_id"
      label="Клиенты"
      clearable
      multiple
      :items="clientItems"
      hide-details
      :style="{ maxWidth: '400px' }"
      @update:model-value="updateSettings($event, 'clients')"
    />
    <v-select
      :model-value="settings.status"
      label="Статус"
      clearable
      hide-details
      :items="statusItems"
      :style="{ maxWidth: '300px' }"
      @update:model-value="updateSettings($event, 'status')"
    />
  </div>
</template>

<script setup>
import store from '@/store'
import { computed } from 'vue'
import { AppTableColumnSetting } from '@/shared/ui'
import { DOCS_REGISTRY_TABLE_HEADERS } from '@/shared/constants'

const settings = defineModel({ type: Object })
const emit = defineEmits(['updateHeaders'])

const clientItems = computed(() => {
  return store.getters.partners.filter((i) => i.isClient)
})

const statusItems = computed(() => {
  return store.getters.docsRegistryStatuses
})

function updateSettings(value, field) {
  settings.value = Object.assign({}, settings.value, { [field]: value })
}

function updateHeadersHandler(val) {
  emit('updateHeaders', val)
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
