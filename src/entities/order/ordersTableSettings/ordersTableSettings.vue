<template>
  <div class="filter-wrapper">
    <AppTableColumnSetting
      :allHeaders="allHeaders"
      listSettingsName="ordersTableHeaders"
      @change="updateHeadersHandler"
    />
    <DateRangeInput :modelValue="settings.period" :min="minDate" class="mx-3" :style="{ 'max-width': '250px' }" />
    <v-select
      v-if="!accountingMode"
      :modelValue="settings.statuses"
      multiple
      label="Статус"
      :items="orderStatuses"
     
      :disabled="accountingMode"
      hideDetails
      variant="outlined"
       density="compact"
      clearable
      :style="{ 'max-width': '250px' }"
      @update:model-value="updateSettingsPage"
    />
    <v-select
      v-if="accountingMode"
      :modelValue="settings.invoiceStatus"
      label="Включен в акт"
      :items="invoiceStatusItems"
     
      hideDetails
      variant="outlined"
       density="compact"
      clearable
      :style="{ 'max-width': '220px' }"
      @update:model-value="updateSettingsPage"
    />

    <OrderDocStatusSelector
      :modelValue="settings.docStatuses"
      multiple
      dense
      label="Документы"
      hideDetails
      outlined
      clearable
      :style="{ 'max-width': '220px' }"
      @change="updateSettingsPage"
    />

    <v-autocomplete
      :modelValue="settings.clients"
      label="Клиенты"
      multiple
      variant="outlined"
       density="compact"
     
      clearable
      autoSelectFirst
      itemValue="_id"
      itemTitle="name"
      :items="clientItems"
      hideDetails
      hideAppendIcon
      :style="{ 'max-width': '220px' }"
      @update:model-value="updateSettingsPage"
    />
    <v-autocomplete
      :modelValue="settings.agreements"
      multiple
      label="Соглашения"
      variant="outlined"
       density="compact"
     
      clearable
      autoSelectFirst
      hideDetails
      hideAppendIcon
      :items="agreementItems"
      itemValue="_id"
      itemTitle="name"
      :style="{ 'max-width': '250px' }"
      @update:model-value="updateSettingsPage"
    />
    <v-autocomplete
      :modelValue="settings.tkNames"
      multiple
      label="ТК"
      :items="$store.getters.tkNames"
      autoSelectFirst
      itemValue="_id"
      itemTitle="name"
     
      hideDetails
      variant="outlined"
       density="compact"
      clearable
      :style="{ 'max-width': '200px' }"
      @update:model-value="updateSettingsPage"
    />
    <v-autocomplete
      :modelValue="settings.trucks"
      multiple
     
      clearable
      autoSelectFirst
      :items="trucks"
      variant="outlined"
       density="compact"
      hideDetails
      label="Грузовик"
      :style="{ 'max-width': '350px', 'min-width': '280px' }"
      @update:model-value="updateSettingsPage"
    />
    <v-autocomplete
      :modelValue="settings.trailer"
     
      clearable
      :items="trailers"
      variant="outlined"
       density="compact"
      hideDetails
      label="Прицеп"
      :style="{ 'max-width': '200px' }"
      @update:model-value="updateSettingsPage"
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
      @update:model-value="updateSettingsPage"
    />
    <v-autocomplete
      :modelValue="settings.loadingZones"
      multiple
      label="Зона погрузки"
     
      autoSelectFirst
      :items="$store.getters.zones"
      clearable
      itemValue="_id"
      itemTitle="name"
      variant="outlined"
       density="compact"
      hideDetails
      :style="{ 'max-width': '210px' }"
      @update:model-value="updateSettingsPage"
    />

    <v-autocomplete
      :modelValue="settings.address"
      :items="addressItems"
      label="Адрес"
     
      clearable
      autoSelectFirst
      variant="outlined"
       density="compact"
      hideDetails
      :style="{ 'min-width': '550px', 'max-width': '900px' }"
      @update:model-value="updateSettingsPage"
    />
    <v-text-field
      :modelValue="settings.searchNum"
      label="Поиск по номеру"
     
      hideAppendIcon
      variant="outlined"
       density="compact"
      hideDetails
      :style="{ 'max-width': '300px' }"
      @change="updateSettings($event, 'searchNum')"
    />
    <v-switch v-if="availableAccountantMode" :modelValue="settings.accountingMode" label="Бухгалтер" />
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
      variant="text"
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
import { AppTableColumnSetting, DateRangeInput, OrderDocStatusSelector } from '@/shared/ui'
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
    const availableAccountantMode = computed(() => store.getters.hasPermission('orderListForAccountant'))

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

    function updateSettingsPage() {
      ctx.emit('change', Object.assign({}, props.settings, { listOptions: { ...props.settings.listOptions, page: 1 } }))
    }

    return {
      updateSettings,
      updateSettingsPage,
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
