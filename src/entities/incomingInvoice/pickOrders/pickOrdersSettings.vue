<template>
  <div class="settings-wrapper">
    <v-btn icon @click="refreshHandler">
      <v-icon>mdi-refresh</v-icon>
    </v-btn>
    <DateRangeInput v-model="settings.period" class="mx-2" />
    <OrderDocStatusSelector
      v-model="settings.docStatuses"
      variant="outlined"
      multiple
      clearable
      density="compact"
      label="Документы"
      hide-details
      :style="{ 'max-width': '400px' }"
    />
    <v-checkbox
      v-model="settings.includedIntoPaymentInvoice"
      density="compact"
      label="Только рейсы, включенные в исходящие акты"
    />
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
  setup(_props, ctx) {
    function refreshHandler() {
      ctx.emit('refresh')
    }
    return {
      refreshHandler,
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
