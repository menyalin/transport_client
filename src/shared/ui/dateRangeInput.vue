<template>
  <div class="date-range-wrapper">
    <div class="text-caption">Выбор периода</div>
    <div class="inputs-row">
      <span id="menu-activator">
        <span class="date-text">
          c:
          {{ tmpPeriod[0] ? new Date(tmpPeriod[0]).toLocaleDateString() : '-' }}
        </span>
        <span class="date-text">
          по:
          {{ tmpPeriod[1] ? new Date(tmpPeriod[1]).toLocaleDateString() : '-' }}
        </span>
      </span>

      <v-menu
        activator="#menu-activator"
        :close-on-content-click="false"
        transition="scale-transition"
        max-width="290px"
        min-width="auto"
      >
        <v-date-picker
          v-model="tmpPeriod"
          no-title
          color="primary"
          @change="changeDate"
        />
      </v-menu>
    </div>
  </div>
</template>
<script setup lang="ts">
import { ref, watch } from 'vue'
import dayjs from 'dayjs'

type Period = [string | null, string | null]

const props = defineProps<{
  period: Period
  min: string
}>()

const emit = defineEmits<{
  (e: 'change', value: string[]): void
}>()

const tmpPeriod = ref<Period>([null, null])

watch(
  () => props.period,
  (val) => {
    console.log('val in dateRangeInput', val)
    tmpPeriod.value = val
  },
  { immediate: true, deep: true }
)

const changeDate = (val: string[]) => {
  if (!val || val.length !== 2) return
  const tmpVal = val

  if (dayjs(val[1]).isBefore(val[0], 'day')) tmpVal.reverse()

  emit('change', [
    dayjs(tmpVal[0]).startOf('day').toISOString(),
    dayjs(tmpVal[1]).endOf('day').toISOString(),
  ])
}
</script>
<style>
.date-range-wrapper {
  width: 280px;
}
.inputs-row {
  display: flex;
  flex-direction: row;
  justify-content: space-evenly;
  flex-wrap: nowrap;
}
.date-text {
  text-decoration: underline;
  text-decoration-color: blue;
}
</style>
