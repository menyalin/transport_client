<template>
  <PickOrders :invoiceId="invoiceId" :agreementId="agreementId" :carrierId="carrierId" />
</template>
<script setup>
import PickOrders from '@/entities/incomingInvoice/pickOrders/pickOrders.vue'

defineOptions({ name: 'PickOrdersForIncomingInvoicePage' })

defineProps({
  invoiceId: {
    type: String,
    required: true,
  },
  agreementId: {
    type: String,
    required: true,
  },
  carrierId: {
    type: String,
    required: true,
  },
})
</script>
<style lang=""></style>
