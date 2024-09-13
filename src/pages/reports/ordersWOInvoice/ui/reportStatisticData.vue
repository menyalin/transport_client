<template>
  <table>
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
  </table>
</template>
<script lang="ts">
//@ts-nocheck
import { defineComponent } from 'vue'
import { computed } from 'vue'

import { moneyFormatter } from '@/shared/utils/moneyFormatter'
export default defineComponent({
  name: 'ReportStatisticData',
  components: {},
  props: {
    data: {
      type: Object,
    },
  },
  setup(props) {
    const totalWOVat = computed(() => {
      return moneyFormatter(props.data.total.woVat, 0)
    })

    const totalWithVat = computed(() => {
      return moneyFormatter(props.data.total.withVat, 0)
    })
    return {
      totalWOVat,
      totalWithVat,
    }
  },
})
</script>
<style scoped>
tr td:nth-child(2) {
  font-weight: 500;
  text-align: right;
  min-width: 70px;
}
</style>
