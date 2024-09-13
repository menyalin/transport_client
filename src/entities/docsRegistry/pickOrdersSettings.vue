<template>
  <div class="settings-wrapper">
    <app-table-column-setting
      :allHeaders="allHeaders"
      listSettingsName="pickOrdersTable"
      @change="updateHeadersHandler"
    />
    <v-btn icon @click="refreshHandler"> <v-icon>mdi-refresh</v-icon></v-btn>
    <date-range-input v-model="localSettings.period" class="mx-2" />
    <v-select
      v-model="localSettings.docStatus"
      label="Документы"
      :items="docStatuses"
      dense
      hide-details
      outlined
      clearable
      :style="{ 'max-width': '220px' }"
      @change="localSettings.listOptions.page = 1"
    />
    <v-autocomplete
      v-model="localSettings.truck"
      dense
      clearable
      auto-select-first
      :items="trucks"
      outlined
      hide-details
      label="Грузовик"
      :style="{ 'max-width': '200px' }"
      @change="localSettings.listOptions.page = 1"
    />
    <v-autocomplete
      v-model="localSettings.driver"
      dense
      auto-select-first
      item-value="_id"
      item-text="fullName"
      clearable
      :items="drivers"
      outlined
      hide-details
      label="Водитель"
      :style="{ 'max-width': '300px' }"
      @change="localSettings.listOptions.page = 1"
    />
    <v-autocomplete
      v-model="localSettings.loadingZone"
      dense
      auto-select-first
      item-value="_id"
      item-text="name"
      clearable
      :items="loadingZoneItems"
      outlined
      hide-details
      label="Зона погрузки"
      :style="{ 'max-width': '250px' }"
      @change="localSettings.listOptions.page = 1"
    />
    <v-text-field
      :value="settings.search"
      dense
      clearable
      outlined
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
      dense
    />
  </div>
</template>
<script setup lang="ts">
import { reactive } from 'vue'

import { useOrderListSettingsData } from '@/shared/hooks'
import { AppTableColumnSetting, DateRangeInput } from '@/shared/ui'

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
