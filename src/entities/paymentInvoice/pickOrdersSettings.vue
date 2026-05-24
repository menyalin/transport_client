<template>
  <div class="settings-wrapper">
    <app-table-column-setting
      :allHeaders="allHeaders"
      listSettingsName="pickOrdersForPaymentInvoiceTable"
      @change="updateHeadersHandler"
    />
    <v-btn @click="refreshHandler" icon> <v-icon>mdi-refresh</v-icon></v-btn>

    <date-range-input
      :value="settings.period"
      class="mx-2"
      @change="changeHandler($event, 'period')"
    />

    <v-autocomplete
      :model-value="settings.truck"
      clearable
      auto-select-first
      :items="trucks"
      hide-details
      label="Грузовик"
      :style="{ 'max-width': '200px' }"
      @update:model-value="changeHandler($event, 'truck')"
    />

    <v-text-field
      :model-value="settings.search"
      clearable
      hide-details
      label="Поиск по номеру"
      :style="{ 'max-width': '300px' }"
      @change="changeHandler($event, 'search')"
    />
    <order-doc-status-selector
      :value="settings.docStatuses"
      multiple
      label="Документы"
      hide-details
      clearable
      :style="{ 'max-width': '400px' }"
      @change="changeHandler($event, 'docStatuses')"
    />
    <v-autocomplete
      :model-value="settings.loadingZones"
      :items="loadingZoneItems"
      label="Зоны погрузки"
      item-value="_id"
      item-title="name"
      multiple
      auto-select-first
      hide-details
      clearable
      :style="{ 'max-width': '500px' }"
      @update:model-value="changeHandler($event, 'loadingZones')"
    />
  </div>
</template>
<script>
import { AppTableColumnSetting, DateRangeInput, OrderDocStatusSelector } from '@/shared/ui'
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

    function changeHandler(val, field) {
      emit('change', {
        ...props.settings,
        [field]: val,
      })
    }

    return {
      refreshHandler,
      updateHeadersHandler,
      changeHandler,
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
