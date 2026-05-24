<template>
  <div class="settings-wrapper">
    <app-table-column-setting
      :allHeaders="allHeaders"
      listSettingsName="pickOrdersTable"
      @change="updateHeadersHandler"
    />
    <v-btn @click="refreshHandler" icon> <v-icon>mdi-refresh</v-icon></v-btn>
    <date-range-input v-model="settings.period" class="mx-2" />
    <v-select
      v-model="settings.docStatus"
      label="Документы"
      :items="docStatuses"
      hide-details
      clearable
      :style="{ 'max-width': '220px' }"
      @update:model-value="settings.listOptions.page = 1"
    />
    <v-autocomplete
      v-model="settings.truck"
      clearable
      auto-select-first
      :items="trucks"
      hide-details
      label="Грузовик"
      :style="{ 'max-width': '200px' }"
      @update:model-value="settings.listOptions.page = 1"
    />
    <v-autocomplete
      v-model="settings.driver"
      auto-select-first
      item-value="_id"
      item-title="fullName"
      clearable
      :items="drivers"
      hide-details
      label="Водитель"
      :style="{ 'max-width': '300px' }"
      @update:model-value="settings.listOptions.page = 1"
    />
    <v-autocomplete
      v-model="settings.loadingZone"
      auto-select-first
      item-value="_id"
      item-title="name"
      clearable
      :items="loadingZoneItems"
      hide-details
      label="Зона погрузки"
      :style="{ 'max-width': '250px' }"
      @update:model-value="settings.listOptions.page = 1"
    />
    <v-text-field
      :model-value="settings.search"
      clearable
      hide-details
      label="Поиск по номеру"
      :style="{ 'max-width': '300px' }"
      @change="searchInputHandler"
    />
    <v-checkbox
      v-model="settings.onlySelectable"
      label="Только доступные рейсы"
      hide-details
      class="ml-2"
    />
  </div>
</template>
<script>
import { AppTableColumnSetting, DateRangeInput } from '@/shared/ui'
import { useOrderListSettingsData } from '@/shared/hooks'
export default {
  name: 'PickOrdersSettings',
  model: {
    prop: 'settings',
    event: 'change',
  },
  components: { AppTableColumnSetting, DateRangeInput },
  props: {
    settings: Object,
    allHeaders: Array,
  },
  setup(props, { emit }) {
    const { orderStatuses, docStatuses, trailers, trucks, drivers, loadingZoneItems } =
      useOrderListSettingsData()
    const refreshHandler = () => {
      emit('refresh')
    }

    function updateHeadersHandler(val) {
      emit('updateHeaders', val)
    }

    function updateSettings(value, field) {
      emit('change', Object.assign({}, props.settings, { [field]: value }))
    }

    function searchInputHandler(val) {
      emit('change', Object.assign({}, props.settings, { search: val }))
    }

    return {
      refreshHandler,
      updateHeadersHandler,
      searchInputHandler,
      updateSettings,
      orderStatuses,
      docStatuses,
      trailers,
      trucks,
      drivers,
      loadingZoneItems,
    }
  },
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
