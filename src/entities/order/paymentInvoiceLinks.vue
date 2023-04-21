<template>
  <div v-if="showBlock" class="block-wrapper">
    <div v-for="link of links" :key="link.url">
      <router-link :to="link.url">{{ link.text }}</router-link>
    </div>
  </div>
</template>
<script>
import { computed } from 'vue'
import store from '@/store'

export default {
  name: 'PaymentInvoiceLinks',
  props: {
    items: {
      type: Array,
    },
  },
  setup(props) {
    const showBlock = computed(() => {
      return (
        props.items &&
        props.items.length > 0 &&
        store.getters.hasPermission('paymentInvoice:readItem')
      )
    })
    const links = computed(() => {
      return props.items.map((invoice) => ({
        url: '/accounting/paymentInvoice/' + invoice._id,
        text:
          'Акт № ' +
          (invoice.number ? invoice.number : 'б/н') +
          (invoice.sendDate
            ? ' от ' + new Date(invoice.sendDate).toLocaleDateString()
            : ''),
      }))
    })
    return {
      showBlock,
      links,
    }
  },
}
</script>
<style scoped>
.block-wrapper {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
}
</style>
