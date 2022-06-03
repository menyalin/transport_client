<template>
  <v-alert
    color="blue"
    dense
    outlined
    :style="{ width: '100%' }"
  >
    Всего рейсов: <b>{{ ordersCount }}</b>, Сумма:
    <b>{{ Intl.NumberFormat().format(Math.round(totalPrice / 1000)) }}</b>
    тыс.руб
  </v-alert>
</template>
<script>
export default {
  name: 'ReportSummary',
  props: {
    ordersCount: Number,
    totalPrice: Number,
  },
}
</script>
<style scoped></style>
