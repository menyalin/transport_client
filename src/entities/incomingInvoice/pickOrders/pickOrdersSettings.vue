<template>
  <div class="settings-wrapper">
    <v-btn @click="refreshHandler" icon>
      <v-icon>mdi-refresh</v-icon>
    </v-btn>
    <DateRangeInput v-model="settings.period" class="mx-2" />
    <OrderDocStatusSelector
      v-model="settings.docStatuses"
      multiple
      clearable
      label="Документы"
      hide-details
      :style="{ 'max-width': '400px' }"
    />
    <v-checkbox
      v-model="settings.includedIntoPaymentInvoice"
      label="Только рейсы, включенные в исходящие акты"
    />
  </div>
</template>
<script setup>
import { DateRangeInput, OrderDocStatusSelector } from '@/shared/ui'

defineOptions({ name: 'PickOrdersForIncomingInvoiceSettings' })

const settings = defineModel({ type: Object })

const emit = defineEmits(['refresh'])

function refreshHandler() {
  emit('refresh')
}
</script>
<style scoped>
.settings-wrapper {
  display: flex;
  flex-direction: row;
  gap: 15px;
}
</style>
