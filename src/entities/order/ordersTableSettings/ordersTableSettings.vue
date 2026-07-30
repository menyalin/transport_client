<template>
  <div class="filter-wrapper">
    <AppTableColumnSetting
      :allHeaders="allHeaders"
      listSettingsName="ordersTableHeaders"
      @change="updateHeadersHandler"
    />
    <DateRangeInput v-model="settings.period" :min="minDate" class="mx-3" />
    <v-select
      v-if="!accountingMode"
      v-model="settings.statuses"
      multiple
      label="Статус"
      :items="orderStatuses"
      :disabled="accountingMode"
      hide-details
      clearable
      item-title="text"
      item-value="value"
      :style="{ 'min-width': '250px' }"
    />
    <v-select
      v-if="accountingMode || true"
      v-model="settings.invoiceStatus"
      label="Включен в акт"
      :items="invoiceStatusItems"
      hide-details
      clearable
      :style="{ 'min-width': '200px' }"
    />

    <OrderDocStatusSelector
      v-model="settings.docStatuses"
      multiple
      label="Документы"
      hide-details
      clearable
      :style="{
        'min-width': '220px',
      }"
    />

    <v-autocomplete
      v-model="settings.clients"
      label="Клиенты"
      multiple
      item-value="_id"
      item-title="name"
      :items="clientItems"
      hide-details
      hide-append-icon
      :style="{ 'min-width': '220px', 'max-width': '600px' }"
    />
    <v-autocomplete
      v-model="settings.agreements"
      multiple
      label="Соглашения"
      hide-details
      hide-append-icon
      :items="agreementItems"
      item-value="_id"
      item-title="name"
      :style="{ 'min-width': '250px', 'max-width': '600px' }"
    />
    <v-autocomplete
      v-model="settings.tkNames"
      multiple
      label="ТК"
      :items="carrierItems"
      item-value="_id"
      item-title="name"
      hide-details
      :style="{ 'min-width': '200px', 'max-width': '600px' }"
    />
    <v-autocomplete
      v-model="settings.trucks"
      multiple
      :items="trucks"
      hide-details
      item-title="title"
      label="Грузовик"
      :style="{ 'min-width': '200px', 'max-width': '600px' }"
    />
    <v-autocomplete
      v-model="settings.trailer"
      clearable
      :items="trailers"
      hide-details
      item-title="title"
      label="Прицеп"
      :style="{ 'min-width': '200px', 'max-width': '600px' }"
    />
    <v-autocomplete
      v-model="settings.driver"
      item-value="_id"
      item-title="fullName"
      clearable
      :items="drivers"
      hide-details
      label="Водитель"
      :style="{ 'min-width': '280px', 'max-width': '600px' }"
    />
    <v-autocomplete
      v-model="settings.loadingZones"
      multiple
      label="Зона погрузки"
      :items="zoneStore.zones"
      item-value="_id"
      item-title="name"
      hide-details
      :style="{ 'min-width': '200px', 'max-width': '400px' }"
    />

    <v-autocomplete
      v-model="settings.address"
      :items="addressItems"
      label="Адрес"
      clearable
      hide-details
      :style="{ 'min-width': '400px', 'max-width': '600px' }"
    />
    <v-text-field
      v-model="settings.searchNum"
      label="Поиск по номеру"
      hideAppupdated
      settingsendIcon
      hide-details
      :style="{ 'min-width': '300px' }"
    />
    <v-switch
      v-if="availableAccountantMode"
      v-model="settings.accountingMode"
      label="Бухгалтер"
      hide-details
    />
    <v-btn
      v-if="vuexStore.getters.hasPermission('order:groupCreate')"
      color="primary"
      to="/orders/group"
      variant="text"
    >
      Создать группу рейсов
    </v-btn>
    <v-btn
      v-if="vuexStore.getters.hasPermission('order:autoFillRouteDates')"
      color="error"
      variant="text"
      to="/orders/fill_dates"
    >
      Автозаполнение рейсов
    </v-btn>
    <v-btn
      v-if="availableAccountantMode || accountingMode"
      color="primary"
      variant="text"
      @click="putTableToClipboard"
    >
      Поместить в буфер обмена
    </v-btn>
  </div>
</template>
<script setup>
import { computed } from 'vue'
import { useStore } from 'vuex'
import { useZoneStore } from '@/entities/zone/zoneStore'
import { AppTableColumnSetting, DateRangeInput, OrderDocStatusSelector } from '@/shared/ui'
import { useOrderListSettingsData } from '@/shared/hooks'

const vuexStore = useStore()
const zoneStore = useZoneStore()

defineOptions({ name: 'OrdersTableSettings' })

const settings = defineModel({ type: Object })

defineProps({
  settings: Object,
  minDate: String,
  allHeaders: Array,
  carrierItems: {
    type: Array,
    required: true,
  },
})

const emits = defineEmits(['putTableToClipboard', 'updateHeaders'])

const accountingMode = computed(() => settings?.accountingMode)
const availableAccountantMode = computed(() =>
  vuexStore.getters.hasPermission('orderListForAccountant')
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
  emits('putTableToClipboard')
}

function updateHeadersHandler(val) {
  emits('updateHeaders', val)
}
</script>
<style scoped>
.filter-wrapper {
  display: flex;
  flex-wrap: wrap;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
  gap: 10px;
}
.filter-wrapper div {
  flex: 0 1 auto;
}
</style>
