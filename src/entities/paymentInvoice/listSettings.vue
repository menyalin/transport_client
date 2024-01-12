<template>
  <div class="settings-wrapper">
    <app-table-column-setting
      :allHeaders="PAYMENT_INVOICE_TABLE_HEADERS"
      listSettingsName="paymentInvoiceListSettings"
      @change="updateHeadersHandler"
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
      :value="settings.status"
      label="Статус"
      dense
      clearable
      outlined
      hide-details
      :items="statusItems"
      :style="{ maxWidth: '300px' }"
      @change="updateSettings($event, 'status')"
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
import store from '@/store'
import { computed, ref, onMounted } from 'vue'
import { AppTableColumnSetting } from '@/shared/ui'
import { PAYMENT_INVOICE_TABLE_HEADERS } from '@/shared/constants'
import { AgreementService } from '@/shared/services/index'

export default {
  name: 'DocsRegistryListSettingsWidget',
  components: { AppTableColumnSetting },
  model: {
    prop: 'settings',
    event: 'change',
  },
  props: {
    settings: Object,
  },

  setup(props, ctx) {
    const agreementItems = ref([])

    const statusItems = computed(() => {
      return store.getters.docsRegistryStatuses
    })

    function updateSettings(value, field) {
      ctx.emit('change', Object.assign({}, props.settings, { [field]: value }))
    }

    function updateHeadersHandler(val) {
      ctx.emit('updateHeaders', val)
    }
    onMounted(async () => {
      agreementItems.value = await AgreementService.getActiveAgreements()
    })

    return {
      agreementItems,
      statusItems,
      updateHeadersHandler,
      updateSettings,
      PAYMENT_INVOICE_TABLE_HEADERS,
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
