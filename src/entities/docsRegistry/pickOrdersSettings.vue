<template>
  <div class="settings-wrapper">
    <app-table-column-setting
      :allHeaders="allHeaders"
      listSettingsName="pickOrdersTable"
      @change="updateHeadersHandler"
    />
    <v-btn icon @click="refreshHandler"> <v-icon>mdi-refresh</v-icon></v-btn>
    <!-- TODO: fix this -->
    <!-- <date-range-input v-model="localSettings.period" class="mx-2" /> -->
    <v-select
      v-model="localSettings.docStatus"
      label="Документы"
      :items="docStatuses"
      density="compact"
      hide-details
      variant="outlined"
      clearable
      :style="{ 'max-width': '220px' }"
      @update:model-value="localSettings.listOptions.page = 1"
    />
    <v-autocomplete
      v-model="localSettings.truck"
      density="compact"
      clearable
      auto-select-first
      :items="trucks"
      variant="outlined"
      hide-details
      label="Грузовик"
      :style="{ 'max-width': '200px' }"
      @update:model-value="localSettings.listOptions.page = 1"
    />
    <v-autocomplete
      v-model="localSettings.driver"
      density="compact"
      auto-select-first
      item-value="_id"
      item-title="fullName"
      clearable
      :items="drivers"
      variant="outlined"
      hide-details
      label="Водитель"
      :style="{ 'max-width': '300px' }"
      @update:model-value="localSettings.listOptions.page = 1"
    />
    <v-autocomplete
      v-model="localSettings.loadingZone"
      density="compact"
      auto-select-first
      item-value="_id"
      item-title="name"
      clearable
      :items="loadingZoneItems"
      variant="outlined"
      hide-details
      label="Зона погрузки"
      :style="{ 'max-width': '250px' }"
      @update:model-value="localSettings.listOptions.page = 1"
    />
    <v-text-field
      :model-value="settings.search"
      density="compact"
      clearable
      variant="outlined"
      hide-details
      label="Поиск по номеру"
      :style="{ 'max-width': '300px' }"
      @change="searchInputHandler"
    />
    <v-checkbox
      v-model="localSettings.onlySelectable"
      label="Только доступные рейсы"
      hide-details
      class="ml-2"
    />
  </div>
</template>
<script setup lang="ts">
import { reactive } from 'vue'

import { useOrderListSettingsData } from '@/shared/hooks'
import { AppTableColumnSetting } from '@/shared/ui'

const props = defineProps({
  settings: {
    type: Object,
    required: true,
  },
  allHeaders: {
    type: Array,
    required: true,
  },
})

const emit = defineEmits(['refresh', 'updateHeaders', 'change'])

const { docStatuses, trucks, drivers, loadingZoneItems } =
  useOrderListSettingsData({})

const localSettings = reactive({ ...props.settings })

function refreshHandler() {
  emit('refresh')
}

function updateHeadersHandler(val: unknown[]) {
  emit('updateHeaders', val)
}

function searchInputHandler(val: string | null) {
  localSettings.search = val
  emit('change', { ...localSettings })
}
</script>
<style scoped>
.settings-wrapper {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  gap: 10px;
}
</style>
