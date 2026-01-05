<template>
  <v-alert outlined dense>
    Ставка НДС: <b>{{ vatRate }}</b> ; Расчет от цены с НДС:
    <b>{{ usePriceWithVat }} </b>
    <br />
    Сумма: <b>{{ total }}</b>
    <br />

    Сумма без НДС: <b> {{ totalWOVat }}</b> Сумма НДС:
    <b>{{ vatSum }}</b> Кол-во рейсов: <b>{{ ordersCount }}</b>
  </v-alert>
</template>
<script>
import { moneyFormatter } from '@/shared/utils/moneyFormatter'
import { computed } from 'vue'
export default {
  name: 'PaymentInvoiceResult',
  props: {
    orders: { type: Array, required: true, default: () => [] },
    vatRate: Number,
    usePriceWithVat: Boolean,
  },
  setup(props) {
    const total = computed(() => {
      const sum = props.orders.reduce(
        (res, item) => res + item?.savedTotal?.price,
        0
      )
      return moneyFormatter(sum)
    })
    const totalWOVat = computed(() => {
      const sum = props.orders.reduce(
        (res, item) => res + item?.savedTotal?.priceWOVat,
        0
      )
      return moneyFormatter(sum)
    })
    const vatSum = computed(() => {
      const sum = props.orders.reduce(
        (res, item) => res + item?.savedTotal?.price,
        0
      )
      const sumWOVat = props.orders.reduce(
        (res, item) => res + item?.savedTotal?.priceWOVat,
        0
      )
      return moneyFormatter(sum - sumWOVat)
    })
    const ordersCount = computed(() => {
      // const ordersOnly = orders.filter((i) => i.itemType !== 'paymentPart')
      return props.orders.filter((i) => i.itemType !== 'paymentPart').length
    })

    return { total, totalWOVat, vatSum, ordersCount }
  },
}
</script>
<style scoped></style>
