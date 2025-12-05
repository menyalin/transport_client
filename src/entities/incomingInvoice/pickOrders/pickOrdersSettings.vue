<template>
  <div class="settings-wrapper">
    <v-btn icon @click="refreshHandler">
      <v-icon>mdi-refresh</v-icon>
    </v-btn>
    <DateRangeInput :modelValue="settings.period" class="mx-2" @update:model-value="updateSettings($event, 'period')" />
    <OrderDocStatusSelector
      :modelValue="settings.docStatuses"
      variant="outlined"
      multiple
      clearable
     
      label="Документы"
      hideDetails
      :style="{ 'max-width': '400px' }"
      @update:model-value="updateSettings($event, 'docStatuses')"
    />
    <v-checkbox :modelValue="settings.includedIntoPaymentInvoice" label="Только рейсы, включенные в исходящие акты" @update:model-value="updateSettings($event, 'includedIntoPaymentInvoice')" />
  </div>
</template>
<script>
import { DateRangeInput, OrderDocStatusSelector } from '@/shared/ui'

export default {
  name: 'PickOrdersForIncomingInvoiceSettings',
  components: { DateRangeInput, OrderDocStatusSelector },

  model: {
    prop: 'settings',
    event: 'change',
  },
  props: {
    settings: Object,
  },
  setup(props, ctx) {
    function refreshHandler() {
      ctx.emit('refresh')
    }

    function updateSettings(value, field) {
      ctx.emit('change', Object.assign({}, props.settings, { [field]: value }))
    }

    return {
      refreshHandler,
      updateSettings,
    }
  },
}
</script>
<style scoped>
  .settings-wrapper {
    display: flex;
    flex-direction: row;
    gap: 15px;
  }
</style>
