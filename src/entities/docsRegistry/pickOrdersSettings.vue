<template>
  <div class="settings-wrapper">
    <AppTableColumnSetting :allHeaders="allHeaders" listSettingsName="pickOrdersTable" @change="updateHeadersHandler" />
    <v-btn icon @click="refreshHandler"><v-icon>mdi-refresh</v-icon></v-btn>
    <DateRangeInput :modelValue="settings.period" class="mx-2" @update:model-value="updateSettings($event, 'period')" />
    <v-select
      :modelValue="settings.docStatus"
      label="Документы"
      :items="docStatuses"
     
      hideDetails
      variant="outlined"
       density="compact"
      clearable
      :style="{ 'max-width': '220px' }"
      @update:model-value="updateDocStatus"
    />
    <v-autocomplete
      :modelValue="settings.truck"
     
      clearable
      autoSelectFirst
      :items="trucks"
      variant="outlined"
       density="compact"
      hideDetails
      label="Грузовик"
      :style="{ 'max-width': '200px' }"
      @update:model-value="updateTruck"
    />
    <v-autocomplete
      :modelValue="settings.driver"
     
      autoSelectFirst
      itemValue="_id"
      itemTitle="fullName"
      clearable
      :items="drivers"
      variant="outlined"
       density="compact"
      hideDetails
      label="Водитель"
      :style="{ 'max-width': '300px' }"
      @update:model-value="updateDriver"
    />
    <v-autocomplete
      :modelValue="settings.loadingZone"
     
      autoSelectFirst
      itemValue="_id"
      itemTitle="name"
      clearable
      :items="loadingZoneItems"
      variant="outlined"
       density="compact"
      hideDetails
      label="Зона погрузки"
      :style="{ 'max-width': '250px' }"
      @update:model-value="updateLoadingZone"
    />
    <v-text-field
      :modelValue="settings.search"
     
      clearable
      variant="outlined"
       density="compact"
      hideDetails
      label="Поиск по номеру"
      :style="{ 'max-width': '300px' }"
      @change="searchInputHandler"
    />
    <v-checkbox :modelValue="settings.onlySelectable" label="Только доступные рейсы" hideDetails class="ml-2" @update:model-value="updateSettings($event, 'onlySelectable')" />
  </div>
</template>
<script>
import { AppTableColumnSetting, DateRangeInput } from '@/shared/ui'
import { useOrderListSettingsData } from '@/shared/hooks'
export default {
  name: 'PickOrdersSettings',
    components: { AppTableColumnSetting, DateRangeInput },
    model: {
      prop: 'settings',
      event: 'change',
    },
  props: {
    settings: Object,
    allHeaders: Array,
  },
  setup(props, { emit }) {
    const { orderStatuses, docStatuses, trailers, trucks, drivers, loadingZoneItems } = useOrderListSettingsData()
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

    function updateSettingsPage() {
      emit('change', Object.assign({}, props.settings, { listOptions: { ...props.settings.listOptions, page: 1 } }))
    }

    function updateDocStatus(value) {
      emit('change', Object.assign({}, props.settings, { docStatus: value, listOptions: { ...props.settings.listOptions, page: 1 } }))
    }

    function updateTruck(value) {
      emit('change', Object.assign({}, props.settings, { truck: value, listOptions: { ...props.settings.listOptions, page: 1 } }))
    }

    function updateDriver(value) {
      emit('change', Object.assign({}, props.settings, { driver: value, listOptions: { ...props.settings.listOptions, page: 1 } }))
    }

    function updateLoadingZone(value) {
      emit('change', Object.assign({}, props.settings, { loadingZone: value, listOptions: { ...props.settings.listOptions, page: 1 } }))
    }

    return {
      refreshHandler,
      updateHeadersHandler,
      searchInputHandler,
      updateSettings,
      updateSettingsPage,
      updateDocStatus,
      updateTruck,
      updateDriver,
      updateLoadingZone,
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
