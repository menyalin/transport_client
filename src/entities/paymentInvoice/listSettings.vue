<template>
  <div class="settings-wrapper">
    <app-table-column-setting
      :allHeaders="PAYMENT_INVOICE_TABLE_HEADERS"
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
      label="Соглашения"
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
import { computed, ref, onMounted } from 'vue'
import { AppTableColumnSetting, DateRangeInput } from '@/shared/ui'
import {
  PAYMENT_INVOICE_TABLE_HEADERS,
  paymentInvoiceStatuses,
} from '@/shared/constants'
import { AgreementService } from '@/shared/services/index'

export default {
  name: 'PymentInvoiceListSettingsWidget',
  components: { AppTableColumnSetting, DateRangeInput },
  model: {
    prop: 'settings',
    event: 'change',
  },
  props: {
    settings: Object,
  },

  setup(props, ctx) {
    const agreements = ref([])
    const agreementItems = computed(() =>
      agreements.value
        .filter((i) => i.isOutsourceAgreement !== true)
        .sort((a, b) => (a.name < b.name ? -1 : 1))
    )

    const statusItems = computed(() => {
      return paymentInvoiceStatuses
    })
    const periodByItems = [
      { value: 'date', text: 'Дата акта' },
      { value: 'sendDate', text: 'Дата отправки' },
      { value: 'plannedPayDate', text: 'Плановая дата оплаты' },
      { value: 'payDate', text: 'Дата оплаты' },
    ]

    function updateSettings(value, field) {
      ctx.emit('change', Object.assign({}, props.settings, { [field]: value }))
    }

    function updateHeadersHandler(val) {
      ctx.emit('updateHeaders', val)
    }

    onMounted(async () => {
      agreements.value = await AgreementService.getActiveAgreements()
    })

    return {
      agreementItems,
      statusItems,
      updateHeadersHandler,
      updateSettings,
      PAYMENT_INVOICE_TABLE_HEADERS,
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
