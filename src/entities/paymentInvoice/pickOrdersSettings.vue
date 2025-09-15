<template>
  <div class="settings-wrapper">
    <app-table-column-setting
      :allHeaders="allHeaders"
      listSettingsName="pickOrdersForPaymentInvoiceTable"
      @update:model-value="updateHeadersHandler"
    />
    <v-btn icon @click="refreshHandler"> <v-icon>mdi-refresh</v-icon></v-btn>
    <date-range-input v-model="settings.period" class="mx-2" />

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
    <order-doc-status-selector
      v-model="settings.docStatuses"
      multiple
      label="Документы"
      density="compact"
      hide-details
      variant="outlined"
      clearable
      :style="{ 'max-width': '400px' }"
      @update:model-value="settings.listOptions.page = 1"
    />
    <v-autocomplete
      v-model="settings.loadingZones"
      label="Зоны погрузки"
      :items="loadingZoneItems"
      item-value="_id"
      item-title="name"
      multiple
      auto-select-first
      density="compact"
      hide-details
      variant="outlined"
      clearable
      :style="{ 'max-width': '500px' }"
      @update:model-value="settings.listOptions.page = 1"
    />
  </div>
</template>
<script>
import {
  AppTableColumnSetting,
  DateRangeInput,
  OrderDocStatusSelector,
} from '@/shared/ui'
import { useOrderListSettingsData } from '@/shared/hooks'
export default {
  name: 'PickOrdersForPaymentInvoiceSettings',
  model: {
    prop: 'settings',
    event: 'change',
  },
  components: { AppTableColumnSetting, DateRangeInput, OrderDocStatusSelector },
  props: {
    settings: Object,
    allHeaders: Array,
  },
  setup(props, { emit }) {
    const { orderStatuses, trailers, trucks, drivers, loadingZoneItems } =
      useOrderListSettingsData()
    const refreshHandler = () => {
      emit('refresh')
    }

    function updateHeadersHandler(val) {
      emit('updateHeaders', val)
    }

    // function updateSettings(value, field) {
    //   emit('change', Object.assign({}, props.settings, { [field]: value }))
    // }

    function searchInputHandler(val) {
      emit('change', Object.assign({}, props.settings, { search: val }))
    }

    return {
      refreshHandler,
      updateHeadersHandler,
      searchInputHandler,
      // updateSettings,
      orderStatuses,
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
