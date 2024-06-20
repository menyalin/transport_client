<template>
  <div class="filter-wrapper">
    <app-table-column-setting
      :allHeaders="allHeaders"
      listSettingsName="ordersTableHeaders"
      @change="updateHeadersHandler"
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
      dense
      :disabled="accountingMode"
      hide-details
      outlined
      clearable
      :style="{ 'max-width': '250px' }"
      @change="settings.listOptions.page = 1"
    />
    <v-select
      v-if="accountingMode"
      v-model="settings.invoiceStatus"
      label="Включен в акт"
      :items="invoiceStatusItems"
      dense
      hide-details
      outlined
      clearable
      :style="{ 'max-width': '220px' }"
      @change="settings.listOptions.page = 1"
    />

    <v-select
      v-model="settings.docStatuses"
      label="Документы"
      multiple
      :items="docStatuses"
      dense
      hide-details
      outlined
      clearable
      :style="{ 'max-width': '220px' }"
      @change="settings.listOptions.page = 1"
    />

    <v-autocomplete
      v-model="settings.clients"
      label="Клиенты"
      multiple
      outlined
      dense
      clearable
      auto-select-first
      item-value="_id"
      item-text="name"
      :items="clientItems"
      hide-details
      hide-append-icon
      :style="{ 'max-width': '220px' }"
      @change="settings.listOptions.page = 1"
    />
    <v-autocomplete
      v-model="settings.agreements"
      multiple
      label="Соглашения"
      outlined
      dense
      clearable
      auto-select-first
      hide-details
      hide-append-icon
      :items="agreementItems"
      item-value="_id"
      item-text="name"
      :style="{ 'max-width': '250px' }"
      @change="settings.listOptions.page = 1"
    />
    <v-select
      v-model="settings.tkNames"
      multiple
      label="ТК"
      :items="$store.getters.tkNames"
      item-value="_id"
      item-text="name"
      dense
      hide-details
      outlined
      clearable
      :style="{ 'max-width': '200px' }"
      @change="settings.listOptions.page = 1"
    />
    <v-autocomplete
      v-model="settings.trucks"
      multiple
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
      v-model="settings.trailer"
      dense
      clearable
      :items="trailers"
      outlined
      hide-details
      label="Прицеп"
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
      v-model="settings.loadingZones"
      multiple
      label="Зона погрузки"
      dense
      auto-select-first
      :items="$store.getters.zones"
      clearable
      item-value="_id"
      item-text="name"
      outlined
      hide-details
      :style="{ 'max-width': '210px' }"
      @change="settings.listOptions.page = 1"
    />

    <v-autocomplete
      v-model="settings.address"
      :items="addressItems"
      label="Адрес"
      dense
      clearable
      auto-select-first
      outlined
      hide-details
      :style="{ 'min-width': '550px', 'max-width': '900px' }"
      @change="settings.listOptions.page = 1"
    />
    <v-text-field
      :value="settings.searchNum"
      label="Поиск по номеру"
      dense
      hideAppendIcon
      outlined
      hide-details
      :style="{ 'max-width': '300px' }"
      @change="updateSettings($event, 'searchNum')"
    />
    <v-switch
      v-if="availableAccountantMode"
      v-model="settings.accountingMode"
      label="Бухгалтер"
    />
    <v-btn
      v-if="$store.getters.hasPermission('order:groupCreate')"
      color="primary"
      text
      small
      to="/orders/group"
    >
      Создать группу рейсов
    </v-btn>
    <v-btn
      v-if="$store.getters.hasPermission('order:autoFillRouteDates')"
      color="error"
      text
      outlined
      small
      to="/orders/fill_dates"
    >
      Автозаполнение рейсов
    </v-btn>
    <v-btn
      v-if="availableAccountantMode && accountingMode"
      color="primary"
      text
      small
      @click="putTableToClipboard"
    >
      Поместить в буфер обмена
    </v-btn>
  </div>
</template>
<script>
import { computed } from 'vue'
import store from '@/store'
import { AppTableColumnSetting, DateRangeInput } from '@/shared/ui'
import { useOrderListSettingsData } from '@/shared/hooks'

export default {
  name: 'OrdersTableSettings',
  components: { AppTableColumnSetting, DateRangeInput },
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
      docStatuses,
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
      docStatuses,
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
