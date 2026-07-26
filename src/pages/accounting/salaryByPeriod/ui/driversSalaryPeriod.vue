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
<script setup>
import dayjs from 'dayjs'
import { computed, ref, watch } from 'vue'

const modelValue = defineModel({ type: String })

const baseDate = ref(dayjs(modelValue.value))

function changePeriod(val) {
  baseDate.value = baseDate.value.add(val, 'month')
  modelValue.value = baseDate.value.toISOString()
}

const periodTitle = computed(() => {
  return baseDate.value.format('MMMM, YYYY').toUpperCase()
})

watch(
  () => modelValue.value,
  (newVal, oldVal) => {
    if (newVal !== oldVal) {
      baseDate.value = dayjs(newVal)
    }
  }
)
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
