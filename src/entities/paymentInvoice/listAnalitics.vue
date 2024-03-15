<template>
  <table border="0">
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
  </table>
</template>
<script>
import { moneyFormatter } from '@/shared/utils'
export default {
  name: 'PaymentInvoiceListAnalitics',
  props: {
    data: {
      type: Object,
      required: true,
      validator: function (value) {
        return (
          value &&
          typeof value.count === 'number' &&
          typeof value.routesCount === 'number' &&
          typeof value.totalSum === 'number' &&
          typeof value.totalSumWOVat === 'number'
        )
      },
    },
  },
  setup() {
    return {
      moneyFormatter,
    }
  },
}
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
