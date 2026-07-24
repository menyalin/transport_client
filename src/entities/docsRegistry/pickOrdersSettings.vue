<template>
  <div class="settings-wrapper">
    <app-table-column-setting
      :allHeaders="allHeaders"
      listSettingsName="pickOrdersTable"
      @change="$emit('update-headers', $event)"
    />
    <v-btn @click="$emit('refresh')" icon size="small"> <v-icon>mdi-refresh</v-icon></v-btn>
    <date-range-input v-model="settings.period" class="mx-2" />
    <v-select
      v-model="settings.docStatus"
      label="Документы"
      :items="docStatuses"
      item-title="text"
      item-value="value"
      hide-details
      clearable
      :style="{ 'max-width': '220px' }"
    />
    <v-autocomplete
      v-model="settings.truck"
      label="Грузовик"
      :items="trucks"
      item-title="title"
      item-value="value"
      hide-details
      :style="{ 'max-width': '200px' }"
    />
    <v-autocomplete
      label="Водитель"
      v-model="settings.driver"
      item-value="_id"
      item-title="fullName"
      :items="drivers"
      hide-details
      :style="{ 'max-width': '300px' }"
    />
    <v-autocomplete
      v-model="settings.loadingZone"
      item-value="_id"
      item-title="name"
      clearable
      :items="loadingZoneItems"
      hide-details
      label="Зона погрузки"
      :style="{ 'max-width': '250px' }"
    />
    <v-text-field
      label="Поиск по номеру"
      v-model="settings.search"
      clearable
      hide-details
      :style="{ 'max-width': '300px' }"
    />
    <v-checkbox v-model="settings.onlySelectable" label="Только доступные рейсы" hide-details />
  </div>
</template>
<script setup>
import { AppTableColumnSetting, DateRangeInput } from '@/shared/ui'
import { useOrderListSettingsData } from '@/shared/hooks'

defineOptions({ name: 'PickOrdersSettings' })
const settings = defineModel('settings')

defineProps({
  allHeaders: Array,
})
defineEmits(['refresh', 'update-headers'])

const { docStatuses, trucks, drivers, loadingZoneItems } = useOrderListSettingsData()
</script>
<style scoped>
.settings-wrapper {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  gap: 10px;
}
</style>
