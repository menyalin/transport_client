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
import { computed, ref, watch } from 'vue'
export default {
  name: 'DriversSalaryPeriod',
  model: {
    prop: 'value', // period
    event: 'change',
  },
  // eslint-disable-next-line vue/require-prop-types
  props: {
    value: String,
  },
  setup(props, ctx) {
    const baseDate = ref(dayjs(props.value))
    function changePeriod(val) {
      baseDate.value = baseDate.value.add(val, 'month')
      ctx.emit('change', baseDate.value.toISOString())
    }

    const periodTitle = computed(() => {
      return baseDate.value.format('MMMM, YYYY').toUpperCase()
    })

    watch(
      () => props.value,
      (newVal, oldVal) => {
        if (newVal !== oldVal) {
          baseDate.value = dayjs(newVal)
        }
      }
    )

    return {
      periodTitle,
      changePeriod,
    }
  },
}
</script>
<style scoped>
.period-wrapper {
  display: flex;
  flex-direction: row;
  gap: 15px;
  width: 300px;
  align-items: center;
  align-content: center;
  justify-content: center;
}
</style>
