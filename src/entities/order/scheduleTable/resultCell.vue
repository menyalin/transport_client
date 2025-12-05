<template>
  <div :style="{ width: '100%', height: '100%' }">
    <div v-if="ordersCount" class="first-row">
      <div>{{ ordersCount['00-06'] }}</div>
      <div>{{ ordersCount['06-12'] }}</div>
      <div>{{ ordersCount['12-18'] }}</div>
      <div>{{ ordersCount['18-24'] }}</div>
    </div>

    <div v-if="ordersCount" class="second-row text-center text-subtitle-2">
      {{ ordersCount.totalInDay }}
    </div>
  </div>
</template>
<script>
import dayjs from 'dayjs'

export default {
  name: 'AppResultCell',
  props: {
    date: {
      type: String,
      required: true,
    },
  },
  computed: {
    ordersCount() {
      if (!this.date) return null
      const dateStr = dayjs(this.date).format('YYYY-MM-DD')
      if (!this.$store.getters.orderCountByDates.has(dateStr)) return null
      return this.$store.getters.orderCountByDates.get(dateStr)
    },
  },
}
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
