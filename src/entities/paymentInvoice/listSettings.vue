<template>
  <div class="settings-wrapper">
    <app-table-column-setting
      :allHeaders="PAYMENT_INVOICE_TABLE_HEADERS"
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
      :model-value="settings.clients"
      item-title="name"
      item-value="_id"
      label="Клиенты"
      :disabled="clientItems.length === 0"
      clearable
      multiple
      :items="clientItems"
      hide-details
      :style="{ maxWidth: '400px' }"
      @update:model-value="updateSettings($event, 'clients')"
    />
    <v-autocomplete
      :model-value="settings.agreements"
      item-title="name"
      item-value="_id"
      label="Соглашения"
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
      multiple
      clearable
      hide-details
      :items="statusItems"
      :style="{ maxWidth: '300px' }"
      @update:model-value="updateSettings($event, 'statuses')"
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

<script setup>
import { computed, ref, onMounted } from 'vue'
import { AppTableColumnSetting, DateRangeInput } from '@/shared/ui'
import { PAYMENT_INVOICE_TABLE_HEADERS, paymentInvoiceStatuses } from '@/shared/constants'
import { AgreementService } from '@/shared/services/index'

defineOptions({ name: 'PymentInvoiceListSettingsWidget' })

const settings = defineModel({ type: Object, required: true })

defineProps({
  clientItems: {
    type: Array,
    required: true,
    default: () => [],
  },
})

const agreements = ref([])
const agreementItems = computed(() =>
  agreements.value
    .filter((i) => i.isOutsourceAgreement !== true)
    .sort((a, b) => (a.name < b.name ? -1 : 1))
)

const statusItems = computed(() => paymentInvoiceStatuses)

const periodByItems = [
  { value: 'date', text: 'Дата акта' },
  { value: 'sendDate', text: 'Дата отправки' },
  { value: 'plannedPayDate', text: 'Плановая дата оплаты' },
  { value: 'payDate', text: 'Дата оплаты' },
]

function updateSettings(value, field) {
  settings.value = { ...settings.value, [field]: value }
}

function updateHeadersHandler(val) {
  emit('updateHeaders', val)
}

const emit = defineEmits(['updateHeaders'])

onMounted(async () => {
  agreements.value = await AgreementService.getActiveAgreements()
})
</script>
<style scoped>
.settings-wrapper {
  display: flex;
  flex-direction: row;
  padding: 10px;
  gap: 15px;
}
</style>
