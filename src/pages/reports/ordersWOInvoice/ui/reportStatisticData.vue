<template>
  <table>
    <tbody>
      <tr>
        <td>Всего рейсов:</td>
        <td>{{ data.count }}</td>
      </tr>
      <tr>
        <td>Сумма без НДС:</td>
        <td>{{ totalWOVat }}</td>
      </tr>
      <tr>
        <td>Сумма c НДС:</td>
        <td>{{ totalWithVat }}</td>
      </tr>
    </tbody>
  </table>
</template>
<script setup>
import { computed } from 'vue'
import { moneyFormatter } from '@/shared/utils/moneyFormatter'

defineOptions({ name: 'ReportStatisticData' })

const props = defineProps({
  data: {
    type: Object,
  },
})

const totalWOVat = computed(() => {
  if (!props.data?.total?.woVat) return 0
  return moneyFormatter(props.data.total.woVat, 0)
})

const totalWithVat = computed(() => {
  if (!props.data?.total?.withVat) return 0
  return moneyFormatter(props.data.total.withVat, 0)
})
</script>
<style scoped>
tr td:nth-child(2) {
  font-weight: 500;
  text-align: right;
  min-width: 70px;
}
</style>
