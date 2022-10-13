<template>
  <div class="period-wrapper">
    <v-btn icon color="primary" @click="changePeriod(-1)">
      <v-icon>mdi-arrow-left</v-icon>
    </v-btn>
    <div :style="{ width: '150px', textAlign: 'center' }">
      {{ periodTitle }}
    </div>
    <v-btn icon color="primary" @click="changePeriod(1)">
      <v-icon>mdi-arrow-right</v-icon>
    </v-btn>
  </div>
</template>
<script>
import dayjs from 'dayjs'
import { computed, onMounted, ref } from 'vue'
export default {
  name: 'DriversSalaryPeriod',
  model: {
    prop: 'value', // period
    event: 'change',
  },
  // eslint-disable-next-line vue/require-prop-types
  props: ['value'],
  setup({ value }, ctx) {
    const baseDate = ref(dayjs())
    function getPeriod() {
      return [baseDate.value.startOf('month'), baseDate.value.endOf('month')]
    }

    function changePeriod(val) {
      baseDate.value = baseDate.value.add(val, 'month')
      ctx.emit('change', getPeriod())
    }

    const periodTitle = computed(() => {
      return baseDate.value.format('MMMM, YYYY').toUpperCase()
    })
    onMounted(() => {
      if (!value) {
        ctx.emit('change', getPeriod())
      }
    })

    return {
      periodTitle,
      changePeriod,
    }
  },
}
</script>
<style scoped>
.period-wrapper {
  padding: 20px;
  display: flex;
  flex-direction: row;
  gap: 15px;
  width: 300px;
  align-items: center;
  align-content: center;
  justify-content: center;
}
</style>
