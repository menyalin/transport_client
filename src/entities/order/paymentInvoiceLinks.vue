<template>
  <div v-if="showBlock" class="block-wrapper">
    <div v-for="link of links" :key="link.url">
      <router-link :to="link.url">{{ link.text }}</router-link>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useStore } from 'vuex'

defineOptions({ name: 'PaymentInvoiceLinks' })

const props = defineProps({
  items: {
    type: Array,
  },
})

const store = useStore()

const showBlock = computed(() => {
  return (
    props.items && props.items.length > 0 && store.getters.hasPermission('paymentInvoice:readItem')
  )
})

const links = computed(() => {
  return props.items?.map((invoice) => ({
    url: '/accounting/paymentInvoice/' + invoice._id,
    text:
      (invoice.number ? invoice.number : 'б/н') +
      (invoice.date ? ' от ' + new Date(invoice.date).toLocaleDateString() : ''),
  }))
})
</script>

<style scoped>
.block-wrapper {
  display: flex;
  flex-direction: column;
  justify-content: center;
  height: 100%;
  font-weight: bold;
}
</style>
