<template>
  <v-alert>
    Ставка НДС: <b>{{ item.vatRate }}%</b> ; Расчет от цены
    <b>{{ item.usePriceWithVat ? ' c НДС' : ' без НДС' }} </b>

    <br />
    Сумма: <b>{{ total }}</b>
    <br />

    Сумма без НДС: <b> {{ totalWOVat }}</b> Сумма НДС: <b>{{ vatSum }}</b> Кол-во рейсов:
    <b>{{ item.ordersCount }}</b>
  </v-alert>
</template>

<script setup>
import { computed } from 'vue'
import { moneyFormatter } from '@/shared/utils/moneyFormatter'

defineOptions({ name: 'PaymentInvoiceResult' })

const props = defineProps({
  item: Object,
})

const total = computed(() => moneyFormatter(props.item.priceWithVat))
const totalWOVat = computed(() => moneyFormatter(props.item.priceWOVat))
const vatSum = computed(() => moneyFormatter(props.item.priceWithVat - props.item.priceWOVat))
</script>

<style scoped></style>
