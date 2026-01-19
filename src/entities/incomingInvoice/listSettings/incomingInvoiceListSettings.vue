<template>
  <div class="settings-wrapper">
    <app-table-column-setting
      :allHeaders="allHeaders"
      listSettingsName="paymentInvoiceListSettings"
      @change="updateHeadersHandler"
    />
    <v-select
      label="Период по"
      :value="settings.periodBy"
      :items="periodByItems"
      outlined
      dense
      :style="{ maxWidth: '300px' }"
      @change="updateSettings($event, 'periodBy')"
    />
    <DateRangeInput
      :period="settings.period"
      @change="updateSettings($event, 'period')"
    />
    <v-autocomplete
      :value="settings.agreements"
      item-text="name"
      item-value="_id"
      label="Соглашения с ТК"
      :disabled="agreementItems.length === 0"
      dense
      clearable
      multiple
      outlined
      :items="agreementItems"
      hide-details
      :style="{ maxWidth: '400px' }"
      @change="updateSettings($event, 'agreements')"
    />
    <v-select
      :value="settings.statuses"
      label="Статус"
      multiple
      dense
      clearable
      outlined
      hide-details
      :items="statusItems"
      :style="{ maxWidth: '300px' }"
      @change="updateSettings($event, 'statuses')"
    />
    <v-autocomplete
      :value="settings.carriers"
      label="Перевозчики"
      multiple
      item-text="name"
      auto-select-first
      item-value="_id"
      dense
      clearable
      outlined
      hide-details
      :items="outsourceCarriers"
      :style="{ maxWidth: '400px' }"
      @change="updateSettings($event, 'carriers')"
    />
    <v-text-field
      :value="settings.search"
      label="Поиск по номеру"
      dense
      clearable
      outlined
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
