<template>
  <div class="settings-wrapper">
    <app-table-column-setting
      :allHeaders="allHeaders"
      listSettingsName="pickOrdersTable"
      @update:model-value="updateHeadersHandler"
    />
    <v-btn icon @click="refreshHandler"> <v-icon>mdi-refresh</v-icon></v-btn>
    <date-range-input v-model="settings.period" class="mx-2" />
    <v-select
      v-model="settings.docStatus"
      label="Документы"
      :items="docStatuses"
      density="compact"
      hide-details
      variant="outlined"
      clearable
      :style="{ 'max-width': '220px' }"
      @update:model-value="settings.listOptions.page = 1"
    />
    <v-autocomplete
      v-model="settings.truck"
      density="compact"
      clearable
      auto-select-first
      :items="trucks"
      variant="outlined"
      hide-details
      label="Грузовик"
      :style="{ 'max-width': '200px' }"
      @update:model-value="settings.listOptions.page = 1"
    />
    <v-autocomplete
      v-model="settings.driver"
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
      @update:model-value="settings.listOptions.page = 1"
    />
    <v-autocomplete
      v-model="settings.loadingZone"
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
      @update:model-value="settings.listOptions.page = 1"
    />
    <v-text-field
      :model-value="settings.search"
      density="compact"
      clearable
      variant="outlined"
      hide-details
      label="Поиск по номеру"
      :style="{ 'max-width': '300px' }"
      @update:model-value="searchInputHandler"
    />
    <v-checkbox
      v-model="settings.onlySelectable"
      label="Только доступные рейсы"
      hide-details
      class="ml-2"
      density="compact"
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
    const {
      orderStatuses,
      docStatuses,
      trailers,
      trucks,
      drivers,
      loadingZoneItems,
    } = useOrderListSettingsData()
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
