<template>
  <div class="settings-wrapper">
    <app-table-column-setting
      :allHeaders="allHeaders"
      listSettingsName="paymentInvoiceListSettings"
      @change="updateHeadersHandler"
    />
    <v-select
      label="Период по"
      :model-value="settings.periodBy"
      :items="periodByItems"
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
      itemTitle="text"
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
      @change="updateSettings($event, 'search')"
    />
  </div>
</template>
<script>
import { computed } from 'vue'
import { incomingInvoiceStatuses } from '../config.js'
import allHeaders from './allHeaders.js'
import { AppTableColumnSetting, DateRangeInput } from '@/shared/ui'

export default {
  name: 'IncomingInvoiceListSettings',
  components: { AppTableColumnSetting, DateRangeInput },
  model: {
    prop: 'settings',
    event: 'change',
  },
  props: {
    settings: Object,
    agreementItems: Array,
    outsourceCarriers: {
      type: Array,
      required: true,
    },
  },
  setup(props, ctx) {
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
      ctx.emit('change', { ...props.settings, [field]: value })
    }

    function updateHeadersHandler(val) {
      ctx.emit('updateHeaders', val)
    }
    return {
      statusItems,
      updateHeadersHandler,
      updateSettings,

      allHeaders,
      periodByItems,
    }
  },
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
