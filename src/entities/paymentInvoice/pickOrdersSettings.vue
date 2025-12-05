<template>
  <div class="settings-wrapper">
    <AppTableColumnSetting
      :allHeaders="allHeaders"
      listSettingsName="pickOrdersForPaymentInvoiceTable"
      @change="updateHeadersHandler"
    />
    <v-btn icon @click="refreshHandler"><v-icon>mdi-refresh</v-icon></v-btn>
    <DateRangeInput :modelValue="settings.period" class="mx-2" />

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
      @update:model-value="updateSettingsPage"
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
    <OrderDocStatusSelector
      :modelValue="settings.docStatuses"
      multiple
      label="Документы"
      dense
      hideDetails
      outlined
      clearable
      :style="{ 'max-width': '400px' }"
      @change="updateSettingsPage"
    />
    <v-autocomplete
      :modelValue="settings.loadingZones"
      label="Зоны погрузки"
      :items="loadingZoneItems"
      itemValue="_id"
      itemTitle="name"
      multiple
      autoSelectFirst
     
      hideDetails
      variant="outlined"
       density="compact"
      clearable
      :style="{ 'max-width': '500px' }"
      @update:model-value="updateSettingsPage"
    />
  </div>
</template>
<script>
import { AppTableColumnSetting, DateRangeInput, OrderDocStatusSelector } from '@/shared/ui'
import { useOrderListSettingsData } from '@/shared/hooks'
export default {
  name: 'PickOrdersForPaymentInvoiceSettings',
    components: { AppTableColumnSetting, DateRangeInput, OrderDocStatusSelector },
    model: {
      prop: 'settings',
      event: 'change',
    },
  props: {
    settings: Object,
    allHeaders: Array,
  },
  setup(props, { emit }) {
    const { orderStatuses, trailers, trucks, drivers, loadingZoneItems } = useOrderListSettingsData()
    const refreshHandler = () => {
      emit('refresh')
    }

    function updateHeadersHandler(val) {
      emit('updateHeaders', val)
    }

    function updateSettings(value, field) {
      emit('change', Object.assign({}, props.settings, { [field]: value }))
    }

    function updateSettingsPage() {
      emit('change', Object.assign({}, props.settings, { listOptions: { ...props.settings.listOptions, page: 1 } }))
    }

    function searchInputHandler(val) {
      emit('change', Object.assign({}, props.settings, { search: val }))
    }

    return {
      refreshHandler,
      updateHeadersHandler,
      searchInputHandler,
      updateSettings,
      updateSettingsPage,
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
