<template>
  <div class="filter-wrapper">
    <app-table-column-setting
      :allHeaders="allHeaders"
      listSettingsName="ordersTableHeaders"
      @update:model-value="updateHeadersHandler"
    />
    <date-range-input
      v-model="settings.period"
      :min="minDate"
      class="mx-3"
      :style="{ 'max-width': '250px' }"
    />
    <v-select
      v-if="!accountingMode"
      v-model="settings.statuses"
      multiple
      label="Статус"
      :items="orderStatuses"
      density="compact"
      :disabled="accountingMode"
      hide-details
      variant="outlined"
      clearable
      :style="{ 'max-width': '250px' }"
      @update:model-value="settings.listOptions.page = 1"
    />
    <v-select
      v-if="accountingMode"
      v-model="settings.invoiceStatus"
      label="Включен в акт"
      :items="invoiceStatusItems"
      density="compact"
      hide-details
      variant="outlined"
      clearable
      :style="{ 'max-width': '220px' }"
      @update:model-value="settings.listOptions.page = 1"
    />

    <order-doc-status-selector
      v-model="settings.docStatuses"
      multiple
      density="compact"
      label="Документы"
      hide-details
      variant="outlined"
      clearable
      :style="{ 'max-width': '220px' }"
      @update:model-value="settings.listOptions.page = 1"
    />

    <v-autocomplete
      v-model="settings.clients"
      label="Клиенты"
      multiple
      variant="outlined"
      density="compact"
      clearable
      auto-select-first
      item-value="_id"
      item-title="name"
      :items="clientItems"
      hide-details
      hide-append-icon
      :style="{ 'max-width': '220px' }"
      @update:model-value="settings.listOptions.page = 1"
    />
    <v-autocomplete
      v-model="settings.agreements"
      multiple
      label="Соглашения"
      variant="outlined"
      density="compact"
      clearable
      auto-select-first
      hide-details
      hide-append-icon
      :items="agreementItems"
      item-value="_id"
      item-title="name"
      :style="{ 'max-width': '250px' }"
      @update:model-value="settings.listOptions.page = 1"
    />
    <v-autocomplete
      v-model="settings.tkNames"
      multiple
      label="ТК"
      :items="$store.getters.tkNames"
      auto-select-first
      item-value="_id"
      item-title="name"
      density="compact"
      hide-details
      variant="outlined"
      clearable
      :style="{ 'max-width': '200px' }"
      @update:model-value="settings.listOptions.page = 1"
    />
    <v-autocomplete
      v-model="settings.trucks"
      multiple
      density="compact"
      clearable
      auto-select-first
      :items="trucks"
      variant="outlined"
      hide-details
      label="Грузовик"
      :style="{ 'max-width': '350px', 'min-width': '280px' }"
      @update:model-value="settings.listOptions.page = 1"
    />
    <v-autocomplete
      v-model="settings.trailer"
      density="compact"
      clearable
      :items="trailers"
      variant="outlined"
      hide-details
      label="Прицеп"
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
      v-model="settings.loadingZones"
      multiple
      label="Зона погрузки"
      density="compact"
      auto-select-first
      :items="$store.getters.zones"
      clearable
      item-value="_id"
      item-title="name"
      variant="outlined"
      hide-details
      :style="{ 'max-width': '210px' }"
      @update:model-value="settings.listOptions.page = 1"
    />

    <v-autocomplete
      v-model="settings.address"
      :items="addressItems"
      label="Адрес"
      density="compact"
      clearable
      auto-select-first
      variant="outlined"
      hide-details
      :style="{ 'min-width': '550px', 'max-width': '900px' }"
      @update:model-value="settings.listOptions.page = 1"
    />
    <v-text-field
      :model-value="settings.searchNum"
      label="Поиск по номеру"
      density="compact"
      hideAppendIcon
      variant="outlined"
      hide-details
      :style="{ 'max-width': '300px' }"
      @update:model-value="updateSettings($event, 'searchNum')"
    />
    <v-switch
      v-if="availableAccountantMode"
      v-model="settings.accountingMode"
      label="Бухгалтер"
    />
    <v-btn
      v-if="$store.getters.hasPermission('order:groupCreate')"
      color="primary"
      variant="text"
      size="small"
      to="/orders/group"
    >
      Создать группу рейсов
    </v-btn>
    <v-btn
      v-if="$store.getters.hasPermission('order:autoFillRouteDates')"
      color="error"
      variant="text outlined"
      size="small"
      to="/orders/fill_dates"
    >
      Автозаполнение рейсов
    </v-btn>
    <v-btn
      v-if="availableAccountantMode && accountingMode"
      color="primary"
      variant="text"
      size="small"
      @click="putTableToClipboard"
    >
      Поместить в буфер обмена
    </v-btn>
  </div>
</template>
<script>
import { computed } from 'vue'
import store from '@/store'
import {
  AppTableColumnSetting,
  DateRangeInput,
  OrderDocStatusSelector,
} from '@/shared/ui'
import { useOrderListSettingsData } from '@/shared/hooks'

export default {
  name: 'OrdersTableSettings',
  components: { AppTableColumnSetting, DateRangeInput, OrderDocStatusSelector },
  model: {
    prop: 'settings',
    event: 'change',
  },
  props: {
    settings: Object,
    minDate: String,
    allHeaders: Array,
  },
  setup(props, ctx) {
    const accountingMode = computed(() => props.settings.accountingMode)
    const availableAccountantMode = computed(() =>
      store.getters.hasPermission('orderListForAccountant')
    )

    const {
      orderStatuses,
      trailers,
      trucks,
      drivers,
      addressItems,
      clientItems,
      agreementItems,
      invoiceStatusItems,
    } = useOrderListSettingsData()

    function putTableToClipboard() {
      ctx.emit('putTableToClipboard')
    }

    function updateHeadersHandler(val) {
      ctx.emit('updateHeaders', val)
    }

    function updateSettings(value, field) {
      ctx.emit('change', Object.assign({}, props.settings, { [field]: value }))
    }

    return {
      updateSettings,
      accountingMode,
      availableAccountantMode,
      orderStatuses,
      trailers,
      trucks,
      drivers,
      putTableToClipboard,
      clientItems,
      addressItems,
      updateHeadersHandler,
      invoiceStatusItems,
      agreementItems,
    }
  },
}
</script>
<style scoped>
.filter-wrapper {
  margin: 10px;
  display: flex;
  flex-wrap: wrap;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
  gap: 10px;
}
</style>
