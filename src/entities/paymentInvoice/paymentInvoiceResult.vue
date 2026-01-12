<template>
  <v-alert outlined dense>
    Ставка НДС: <b>{{ item.vatRate }}%</b> ; Расчет от цены
    <b>{{ item.usePriceWithVat ? ' c НДС' : ' без НДС' }} </b>

    <br />
    Сумма: <b>{{ total }}</b>
    <br />

    Сумма без НДС: <b> {{ totalWOVat }}</b> Сумма НДС:
    <b>{{ vatSum }}</b> Кол-во рейсов: <b>{{ item.ordersCount }}</b>
  </v-alert>
</template>
<script>
import { moneyFormatter } from '@/shared/utils/moneyFormatter'
import { computed } from 'vue'
export default {
  name: 'PaymentInvoiceResult',
  props: {
    item: Object,
  },
  setup(props) {
    const total = computed(() => {
      return moneyFormatter(props.item.priceWithVat)
    })
    const totalWOVat = computed(() => {
      return moneyFormatter(props.item.priceWOVat)
    })
    const vatSum = computed(() => {
      return moneyFormatter(props.item.priceWithVat - props.item.priceWOVat)
    })

    return { total, totalWOVat, vatSum }
  },
}
</script>
<style scoped></style>
