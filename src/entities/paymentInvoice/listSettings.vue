<template>
  <div class="settings-wrapper">
    <AppTableColumnSetting
      :allHeaders="PAYMENT_INVOICE_TABLE_HEADERS"
      listSettingsName="paymentInvoiceListSettings"
      @change="updateHeadersHandler"
    />
    <v-select
      label="Период по"
      :modelValue="settings.periodBy"
      :items="periodByItems"
      variant="outlined"
       density="compact"
     
      :style="{ maxWidth: '300px' }"
      @update:model-value="updateSettings($event, 'periodBy')"
    />
    <DateRangeInput :period="settings.period" @change="updateSettings($event, 'period')" />
    <v-autocomplete
      :modelValue="settings.agreements"
      itemTitle="name"
      itemValue="_id"
      label="Соглашения"
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
      :modelValue="settings.statuses"
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
    <v-text-field
      :modelValue="settings.search"
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
import { computed, ref, onMounted } from 'vue'
import { AppTableColumnSetting, DateRangeInput } from '@/shared/ui'
import { PAYMENT_INVOICE_TABLE_HEADERS, paymentInvoiceStatuses } from '@/shared/constants'
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
      agreements.value.filter(i => i.isOutsourceAgreement !== true).sort((a, b) => (a.name < b.name ? -1 : 1))
    )

    const statusItems = computed(() => {
      return paymentInvoiceStatuses
    })
    const periodByItems = [
      {
        value: 'date',
        text: 'Дата акта',
      },
      {
        value: 'sendDate',
        text: 'Дата отправки',
      },
      {
        value: 'plannedPayDate',
        text: 'Плановая дата оплаты',
      },
      {
        value: 'payDate',
        text: 'Дата оплаты',
      },
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
