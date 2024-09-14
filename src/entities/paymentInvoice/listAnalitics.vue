<template>
  <table border="0">
    <tbody>
      <tr>
        <td class="row-title">Всего актов:</td>
        <td class="row-value">{{ data.count }}</td>
      </tr>
      <tr>
        <td class="row-title">Рейсов в актах:</td>
        <td class="row-value">{{ data.routesCount }}</td>
      </tr>
      <tr>
        <td class="row-title">Сумма актов без НДС:</td>
        <td class="row-value">{{ moneyFormatter(data.totalSumWOVat) }}</td>
      </tr>
      <tr>
        <td class="row-title">Сумма актов:</td>
        <td class="row-value">{{ moneyFormatter(data.totalSum) }}</td>
      </tr>
    </tbody>
  </table>
</template>
<script lang="ts">
import { defineComponent } from 'vue'
import { moneyFormatter } from '@/shared/utils'

export default defineComponent({
  name: 'PaymentInvoiceListAnalitics',
  props: {
    data: {
      type: Object,
      required: true,
    },
  },
  setup() {
    return {
      moneyFormatter,
    }
  },
})
</script>
<style scoped>
tr .row-title {
  text-align: right;
}
tr .row-value {
  text-align: right;
  font-weight: bold;
  padding-left: 10px;
}
</style>
