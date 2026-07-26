<template>
  <div :style="{ width: '100%', height: '100%' }">
    <div v-if="ordersCount" class="first-row">
      <div>{{ ordersCount['00-06'] }}</div>
      <div>{{ ordersCount['06-12'] }}</div>
      <div>{{ ordersCount['12-18'] }}</div>
      <div>{{ ordersCount['18-24'] }}</div>
    </div>

    <div v-if="ordersCount" class="second-row text-center text-label-large">
      {{ ordersCount.totalInDay }}
    </div>
  </div>
</template>
<script setup>
import { computed } from 'vue'
import dayjs from 'dayjs'
import { useOrderStore } from '@/entities/order/orderStore'

defineOptions({ name: 'ResultCell' })

const props = defineProps({
  date: {
    type: String,
    required: true,
  },
})

const orderStore = useOrderStore()

const ordersCount = computed(() => {
  if (!props.date) return null
  const dateStr = dayjs(props.date).format('YYYY-MM-DD')
  if (!orderStore.orderCountByDates.has(dateStr)) return null
  return orderStore.orderCountByDates.get(dateStr)
})
</script>
<style scoped>
.first-row {
  display: flex;
  flex-direction: row;
  align-items: center;
  background-color: white;
  margin: 0 1px;
}
.first-row > div {
  width: 25%;
  text-align: center;
  font-size: 10px;
}
.second-row {
  background-color: white;
  margin: 0 1px;
}
</style>
