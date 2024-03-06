<template>
  <v-alert v-if="errors.length > 0" type="error" outlined>
    Ошибка загрузки реестра: <br />
    <ul>
      <li v-for="error in errors" :key="error.message">{{ error }}</li>
    </ul>
  </v-alert>
  <v-alert v-else :type="hasTotalSumDiff ? 'error' : 'info'" outlined>
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
<script>
import { moneyFormatter } from '@/shared/utils'

export default {
  name: 'UploadedInformation',
  props: {
    items: Array,
    errors: Array,
    totalPickedSum: Number,
  },
  computed: {
    ordersTotalSum() {
      if (this.items.length === 0) return 0
      return this.items.reduce((sum, item) => (sum += item.price), 0)
    },
    formattedSum() {
      return moneyFormatter(this.ordersTotalSum)
    },
    formattedPickedSum() {
      return moneyFormatter(this.totalPickedSum)
    },
    hasTotalSumDiff() {
      return this.ordersTotalSum !== this.totalPickedSum
    },
  },
}
</script>
<style scoped></style>
