<template>
  <v-alert v-if="errors.length > 0" type="error">
    Ошибка загрузки реестра: <br />
    <ul>
      <li v-for="error in errors" :key="error.message">{{ error }}</li>
    </ul>
  </v-alert>
  <v-alert v-else :type="hasTotalSumDiff ? 'error' : 'info'">
    Кол-во рейсов в реестре:
    <b>{{ items.length }}</b>
    , Общая сумма реестра:
    <b>{{ formattedSum }}</b>
    <br />
    <div v-if="totalPickedSum">
      Итог по выбранным рейсам: <b>{{ formattedPickedSum }}</b>
    </div>
  </v-alert>
</template>
<script setup>
import { computed } from 'vue'
import { moneyFormatter } from '@/shared/utils'

defineOptions({ name: 'UploadedInformation' })

const props = defineProps({
  items: Array,
  errors: Array,
  totalPickedSum: Number,
})

const ordersTotalSum = computed(() => {
  if (props.items.length === 0) return 0
  return props.items.reduce((sum, item) => (sum += item.price), 0)
})

const formattedSum = computed(() => moneyFormatter(ordersTotalSum.value))

const formattedPickedSum = computed(() => moneyFormatter(props.totalPickedSum))

const hasTotalSumDiff = computed(() => {
  const roundedTotal = Math.round(ordersTotalSum.value * 100) / 100
  const roundedPicked = Math.round(props.totalPickedSum * 100) / 100
  return roundedTotal !== roundedPicked
})
</script>
<style scoped />
