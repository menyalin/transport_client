<template>
  <PickOrders
    :invoiceId="invoiceId"
    :agreementId="agreementId"
    :carrierId="carrierId"
  />
</template>
<script>
import PickOrders from '@/entities/incomingInvoice/pickOrders/pickOrders.vue'

export default {
  name: 'PickOrdersForIncomingInvoicePage',
  components: { PickOrders },
  props: {
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
  },
}
</script>
<style lang=""></style>
