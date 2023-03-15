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
      dense
      hide-details
      outlined
      clearable
      :style="{ 'max-width': '220px' }"
      @change="settings.listOptions.page = 1"
    />
    <v-autocomplete
      v-model="settings.truck"
      dense
      clearable
      auto-select-first
      :items="trucks"
      outlined
      hide-details
      label="Грузовик"
      :style="{ 'max-width': '200px' }"
      @change="settings.listOptions.page = 1"
    />
    <v-autocomplete
      v-model="settings.driver"
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
      @change="settings.listOptions.page = 1"
    />
    <v-autocomplete
      v-model="settings.loadingZone"
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
      @change="settings.listOptions.page = 1"
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
      v-model="settings.onlySelectable"
      label="Только доступные рейсы"
      hide-details
      class="ml-2"
      dense
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
