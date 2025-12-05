<template>
  <div class="wrapper">
    <div class="left-column">
      <div>
        Кол-во:
        <b>{{ data?.count ?? 0 }}</b>
      </div>
      <div>
        Общая сумма штрафов:
        <b>{{ totalSum }}</b>
      </div>
      <div>
        Сумма со скидкой:
        <b>{{ totalSumWithDiscount }}</b>
      </div>
    </div>
    <div class="right-column">
      <div>
        Оплачено:
        <b>{{ totalPayed }}</b>
      </div>
      <div>
        К удержанию:
        <b>{{ needWithheld }}</b>
      </div>
      <div v-if="showIsWithheld">
        Удержано:
        <b>{{ isWithheld }}</b>
      </div>
    </div>
  </div>
</template>
<script>
import { computed } from 'vue'
import store from '@/store'

export default {
  name: 'FineListAnalitics',
  props: {
    data: Object,
  },
  setup(props) {
    function formatSum(sum) {
      if (!sum) return '-'
      if (!isFinite(sum)) return '__invalid number__'
      return Intl.NumberFormat().format(sum)
    }

    const showIsWithheld = computed(() => {
      return store.getters.hasPermission('isWithheldRead')
    })
    const totalSum = computed(() => {
      return formatSum(props.data.totalSum)
    })
    const totalSumWithDiscount = computed(() => {
      return formatSum(props.data.totalSumWithDiscount)
    })
    const totalPayed = computed(() => {
      return formatSum(props.data.totalPayed)
    })
    const needWithheld = computed(() => {
      return formatSum(props.data.needWithheld)
    })

    const isWithheld = computed(() => {
      return formatSum(props.data.isWithheld)
    })

    return {
      showIsWithheld,
      totalSum,
      totalSumWithDiscount,
      totalPayed,
      needWithheld,
      isWithheld,
    }
  },
}
  // Итого штраф, итого штраф со скидкой, итого удержать
</script>
<style scoped>
  .wrapper {
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    align-content: stretch;
  }
  .wrapper > div {
    margin: 10px;
  }
  .left-column {
    display: flex;
    flex-direction: column;
    justify-content: space-evenly;
    align-items: flex-end;
  }
  .right-column {
    display: flex;
    flex-direction: column;
    justify-content: space-evenly;
    align-items: flex-end;
  }
</style>
