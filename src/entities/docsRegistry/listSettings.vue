<template>
  <div class="settings-wrapper">
    <app-table-column-setting
      :allHeaders="DOCS_REGISTRY_TABLE_HEADERS"
      listSettingsName="docsRegistryHeadersList"
      @change="updateHeadersHandler"
    />

    <v-autocomplete
      v-model="settings.clients"
      :items="clientItems"
      item-title="name"
      item-value="_id"
      label="Клиенты"
      clearable
      multiple
      chips
      closable-chips
      hide-details
      :style="{ maxWidth: '600px' }"
    />
    <v-select
      v-model="settings.status"
      label="Статус"
      itemTitle="text"
      clearable
      hide-details
      :items="statusItems"
      :style="{ maxWidth: '350px' }"
    />
  </div>
</template>

<script setup>
import { useStore } from 'vuex'
import { computed } from 'vue'
import { AppTableColumnSetting } from '@/shared/ui'
import DOCS_REGISTRY_TABLE_HEADERS from './docsRegistryTableHeaders'

const vuexStore = useStore()

defineOptions({ name: 'DocsRegistryListSettingsWidget' })

const settings = defineModel('settings')
const emits = defineEmits(['update:headers'])

const clientItems = computed(() => vuexStore.getters.partners.filter((i) => i.isClient))
const statusItems = computed(() => vuexStore.getters.docsRegistryStatuses)

function updateHeadersHandler(val) {
  emits('update:headers', val)
}
</script>
<style scoped>
.settings-wrapper {
  display: flex;
  flex-direction: row;
  padding: 10px;
  gap: 15px;
  align-items: flex-start;
}
</style>
