<template>
  <div class="settings-wrapper">
    <app-table-column-setting
      :allHeaders="PAYMENT_INVOICE_TABLE_HEADERS"
      listSettingsName="paymentInvoiceListSettings"
      @change="updateHeadersHandler"
    />
    <DateRangeInput
      :period="settings?.period"
      @change="updateSettings($event, 'period')"
    />
    <v-autocomplete
      :model-value="settings?.agreements"
      item-title="name"
      item-value="_id"
      label="Соглашения"
      :disabled="agreementItems.length === 0"
      density="compact"
      clearable
      multiple
      variant="outlined"
      :items="agreementItems"
      hide-details
      :style="{ maxWidth: '400px' }"
      @update:model-value="updateSettings($event, 'agreements')"
    />
    <v-select
      :model-value="settings?.statuses"
      label="Статус"
      multiple
      density="compact"
      clearable
      variant="outlined"
      hide-details
      :items="statusItems"
      :style="{ maxWidth: '300px' }"
      @update:model-value="updateSettings($event, 'statuses')"
    />
    <v-text-field
      :model-value="settings?.search"
      label="Поиск по номеру"
      density="compact"
      clearable
      variant="outlined"
      hide-details
      :style="{ maxWidth: '200px' }"
      @change="updateSettings($event, 'search')"
    />
  </div>
</template>

<script lang="ts">
//@ ts-nocheck
import { defineComponent } from 'vue'
import { computed, ref, onMounted } from 'vue'

import { PAYMENT_INVOICE_TABLE_HEADERS } from '@/shared/constants'
import { AgreementService } from '@/shared/services/index'
import { AppTableColumnSetting, DateRangeInput } from '@/shared/ui'
import store from '@/store'

export default defineComponent({
  name: 'DocsRegistryListSettingsWidget',
  components: { AppTableColumnSetting, DateRangeInput },
  model: {
    prop: 'settings',
    event: 'change',
  },
  props: {
    settings: Object,
  },
  // TODO: fix dateRange input
  setup(props, ctx) {
    const agreements = ref<
      { _id: string; name: string; isOutsourceAgreement: boolean }[]
    >([])
    const agreementItems = computed(() =>
      agreements.value
        .filter((i) => i.isOutsourceAgreement !== true)
        .sort((a, b) => (a.name < b.name ? -1 : 1))
    )

    const statusItems = computed(() => {
      return store.getters.docsRegistryStatuses
    })

    function updateSettings(value: unknown, field: string) {
      ctx.emit('change', Object.assign({}, props.settings, { [field]: value }))
    }

    function updateHeadersHandler(val: unknown) {
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
    }
  },
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
