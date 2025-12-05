<template>
  <div v-if="invoice" class="block-wrapper">
    Входящий акт:
    <router-link :to="url">{{ text }}</router-link>
  </div>
  <div v-else :style="{ display: 'flex', justifyContent: 'flex-end', padding: '10px' }">
    <small>Входящий акт не создан</small>
  </div>
</template>
<script>
import { computed } from 'vue'
import { incomingInvoiceStatusMap } from '@/shared/constants'

export default {
  name: 'IncomingInvoiceLink',
  props: {
    invoice: Object,
  },
  setup(props) {
    const statusStr = computed(() => incomingInvoiceStatusMap.get(props.invoice.status))
    const url = computed(() => `/accounting/incomingInvoice/${props.invoice?._id}`)
    const text = computed(() => {
      if (props.invoice) {
        return `  ${props.invoice.number} от ${
          props.invoice.date ? new Date(props.invoice.date).toLocaleDateString() : ''
        } (${statusStr.value})`
      }
      return ''
    })
    return {
      url,
      text,
    }
  },
}
</script>
<style scoped>
  .block-wrapper {
    display: flex;
    flex-direction: row;
    justify-content: flex-end;
    align-items: center;
    font-weight: bold;
    gap: 10px;
  }
</style>
