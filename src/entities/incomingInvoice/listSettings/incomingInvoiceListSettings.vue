<template>
  <div class="settings-wrapper">
    <AppTableColumnSetting
      :allHeaders="allHeaders"
      listSettingsName="paymentInvoiceListSettings"
      @change="updateHeadersHandler"
    />
    <v-select
      label="Период по"
      :modelValue="modelValue.periodBy"
      :items="periodByItems"
      variant="outlined"
       density="compact"
     
      :style="{ maxWidth: '300px' }"
      @update:model-value="updateSettings($event, 'periodBy')"
    />
    <DateRangeInput :period="modelValue.period" @change="updateSettings($event, 'period')" />
    <v-autocomplete
      :modelValue="modelValue.agreements"
      itemTitle="name"
      itemValue="_id"
      label="Соглашения с ТК"
      :disabled="agreementItems.length === 0"
     
      clearable
      multiple
      variant="outlined"
       density="compact"
      :items="agreementItems"
      hideDetails
      :style="{ maxWidth: '400px' }"
      @update:model-value="updateSettings($event, 'agreements')"
    />
    <v-select
      :modelValue="modelValue.statuses"
      label="Статус"
      multiple
     
      clearable
      variant="outlined"
       density="compact"
      hideDetails
      :items="statusItems"
      :style="{ maxWidth: '300px' }"
      @update:model-value="updateSettings($event, 'statuses')"
    />
    <v-autocomplete
      :modelValue="modelValue.carriers"
      label="Перевозчики"
      multiple
      itemTitle="name"
      autoSelectFirst
      itemValue="_id"
     
      clearable
      variant="outlined"
       density="compact"
      hideDetails
      :items="outsourceCarriers"
      :style="{ maxWidth: '400px' }"
      @update:model-value="updateSettings($event, 'carriers')"
    />
    <v-text-field
      :modelValue="modelValue.search"
      label="Поиск по номеру"
     
      clearable
      variant="outlined"
       density="compact"
      hideDetails
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
import { useCarriers } from '@/entities/carrier/useCarriers.js'
export default {
  name: 'IncomingInvoiceListSettings',
  components: { AppTableColumnSetting, DateRangeInput },
  props: {
    modelValue: {
      type: Object,
      required: true,
    },
    agreementItems: Array,
  },
  emits: ['update:modelValue', 'updateHeaders'],
  setup(props, { emit }) {
    const { outsourceCarriers } = useCarriers()
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
      emit('update:modelValue', { ...props.modelValue, [field]: value })
    }

    function updateHeadersHandler(val) {
      emit('updateHeaders', val)
    }
    return {
      statusItems,
      updateHeadersHandler,
      updateSettings,
      outsourceCarriers,
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
