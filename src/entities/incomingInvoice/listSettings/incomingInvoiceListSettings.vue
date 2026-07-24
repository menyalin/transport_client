<template>
  <ListSettingsWrapper>
    <app-table-column-setting
      :allHeaders="allHeaders"
      listSettingsName="paymentInvoiceListSettings"
      @change="updateHeadersHandler"
    />
    <v-select
      label="Период по"
      :model-value="settings.periodBy"
      :items="periodByItems"
      item-title="text"
      item-value="value"
      :style="{ maxWidth: '300px' }"
      @update:model-value="updateSettings($event, 'periodBy')"
    />
    <DateRangeInput
      :model-value="settings.period"
      @update:model-value="updateSettings($event, 'period')"
    />
    <v-autocomplete
      :model-value="settings.agreements"
      item-title="name"
      item-value="_id"
      label="Соглашения с ТК"
      :disabled="agreementItems.length === 0"
      clearable
      multiple
      :items="agreementItems"
      hide-details
      :style="{ maxWidth: '400px' }"
      @update:model-value="updateSettings($event, 'agreements')"
    />
    <v-select
      :model-value="settings.statuses"
      label="Статус"
      item-title="text"
      item-value="value"
      multiple
      clearable
      hide-details
      :items="statusItems"
      :style="{ maxWidth: '300px' }"
      @update:model-value="updateSettings($event, 'statuses')"
    />
    <v-autocomplete
      :model-value="settings.carriers"
      label="Перевозчики"
      multiple
      item-title="name"
      auto-select-first
      item-value="_id"
      clearable
      hide-details
      :items="outsourceCarriers"
      :style="{ maxWidth: '400px' }"
      @update:model-value="updateSettings($event, 'carriers')"
    />
    <v-text-field
      :model-value="settings.search"
      label="Поиск по номеру"
      clearable
      hide-details
      :style="{ maxWidth: '200px' }"
      @update:model-value="updateSettings($event, 'search')"
    />
  </ListSettingsWrapper>
</template>
<script setup>
import { computed } from 'vue'
import { incomingInvoiceStatuses } from '../config.js'
import allHeaders from './allHeaders.js'
import { AppTableColumnSetting, DateRangeInput, ListSettingsWrapper } from '@/shared/ui'

defineOptions({ name: 'IncomingInvoiceListSettings' })

const settings = defineModel({ type: Object })

defineProps({
  agreementItems: Array,
  outsourceCarriers: {
    type: Array,
    required: true,
  },
})

const emit = defineEmits(['updateHeaders'])

const statusItems = computed(() => {
  return incomingInvoiceStatuses
})

const periodByItems = [
  { value: 'date', text: 'Дата акта' },
  { value: 'receiptDate', text: 'Дата получения' },
  { value: 'plannedPayDate', text: 'Плановая дата оплаты' },
  { value: 'payDate', text: 'Дата оплаты' },
]

function updateSettings(value, field) {
  settings.value = { ...settings.value, [field]: value }
}

function updateHeadersHandler(val) {
  emit('updateHeaders', val)
}
</script>
<style scoped>
.settings-wrapper {
  display: flex;
  flex-direction: row;
  padding: 10px;
  gap: 15px;
}
</style>
