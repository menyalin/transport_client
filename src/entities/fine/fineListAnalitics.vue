<template>
  <div class="wrapper">
    <div class="left-column">
      <div>
        Кол-во: <b>{{ data?.count ?? 0 }}</b>
      </div>
      <div>
        Общая сумма штрафов: <b>{{ totalSum }}</b>
      </div>
      <div>
        Сумма со скидкой: <b>{{ totalSumWithDiscount }}</b>
      </div>
    </div>
    <div class="right-column">
      <div>
        Оплачено: <b>{{ totalPayed }}</b>
      </div>
      <div>
        К удержанию: <b>{{ needWithheld }}</b>
      </div>
      <div v-if="showIsWithheld">
        Удержано: <b>{{ isWithheld }}</b>
      </div>
    </div>
  </div>
</template>
<script setup>
import { computed } from 'vue'
import { useStore } from 'vuex'

defineOptions({ name: 'FineListAnalitics' })

const props = defineProps({
  data: Object,
})

const store = useStore()

function formatSum(sum) {
  if (!sum) return '-'
  if (!isFinite(sum)) return '__invalid number__'
  return Intl.NumberFormat().format(sum)
}

const showIsWithheld = computed(() => store.getters.hasPermission('fine:isWithheldRead'))

const totalSum = computed(() => formatSum(props.data?.totalSum))
const totalSumWithDiscount = computed(() => formatSum(props.data?.totalSumWithDiscount))
const totalPayed = computed(() => formatSum(props.data?.totalPayed))
const needWithheld = computed(() => formatSum(props.data?.needWithheld))
const isWithheld = computed(() => formatSum(props.data?.isWithheld))
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
