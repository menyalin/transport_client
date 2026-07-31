<script setup>
import { ref, watch } from 'vue'
import dayjs from 'dayjs'
import DateTimeInput from './DateTimeInput.vue'
import { periodItems } from './config'

const props = defineProps({ modelValue: { type: Array, default: () => [null, null] } })
const emits = defineEmits(['update:model-value', 'period-selected'])
const tmpPeriod = ref([])

function setPeriod(value) {
  const now = dayjs()
  let startDate
  let endDate

  switch (value) {
    case 'today':
      startDate = now.startOf('day')
      endDate = now.endOf('day')
      break

    case 'yesterday':
      startDate = now.subtract(1, 'day').startOf('day')
      endDate = now.subtract(1, 'day').endOf('day')
      break

    case 'dayBeforeYesterday':
      startDate = now.subtract(2, 'day').startOf('day')
      endDate = now.subtract(2, 'day').endOf('day')
      break

    case 'this-week':
      startDate = now.startOf('week')
      endDate = now.endOf('week')
      break

    case 'last-week':
      startDate = now.subtract(1, 'week').startOf('week')
      endDate = now.subtract(1, 'week').endOf('week')
      break

    case 'this-month':
      startDate = now.startOf('month')
      endDate = now.endOf('month')
      break

    case 'last-month':
      startDate = now.subtract(1, 'month').startOf('month')
      endDate = now.subtract(1, 'month').endOf('month')
      break

    case 'this-year':
      startDate = now.startOf('year')
      endDate = now.endOf('year')
      break

    case 'last-year':
      startDate = now.subtract(1, 'year').startOf('year')
      endDate = now.subtract(1, 'year').endOf('year')
      break

    case 'last-7-days':
      startDate = now.subtract(6, 'day').startOf('day')
      endDate = now.endOf('day')
      break

    case 'last-30-days':
      startDate = now.subtract(29, 'day').startOf('day')
      endDate = now.endOf('day')
      break

    default:
      console.warn('Unknown period value:', value)
      return
  }
  emits('update:model-value', [startDate.toISOString(), endDate.toISOString()])
  emits('period-selected')
}
function setCustomDateRange(value, position) {
  const newPeriod = [...tmpPeriod.value]
  newPeriod[position] = value
  tmpPeriod.value = newPeriod
}
function cancelHandler() {
  tmpPeriod.value = [...props.modelValue]
  emits('period-selected')
}
function saveHandler() {
  const period = [...tmpPeriod.value]
  if (period[1]) {
    period[1] = dayjs(period[1]).endOf('day').toISOString()
  }
  emits('update:model-value', period)
  emits('period-selected')
}

watch(
  () => props.modelValue,
  (val) => {
    tmpPeriod.value = val
  },
  { immediate: true }
)
</script>
<template>
  <v-card>
    <v-card-text class="data-wrapper">
      <div class="periods">
        <v-btn
          v-for="item in periodItems"
          :key="item.value"
          size="small"
          variant="text"
          @click="setPeriod(item.value)"
        >
          {{ item.label }}
        </v-btn>
      </div>
      <DateTimeInput
        class="date-input start-date"
        :model-value="tmpPeriod[0]"
        @update:model-value="setCustomDateRange($event, 0)"
      />
      <DateTimeInput
        class="date-input end-date"
        :model-value="tmpPeriod[1]"
        @update:model-value="setCustomDateRange($event, 1)"
      />
    </v-card-text>
    <v-card-actions>
      <v-spacer />
      <v-btn @click="cancelHandler">Отмена</v-btn>
      <v-btn @click="saveHandler">ОК</v-btn>
    </v-card-actions>
  </v-card>
</template>

<style scoped>
.data-wrapper {
  display: grid;
  grid-template-columns: 2fr 3fr 3fr;
  align-items: start;
  gap: 10px;
}

.date-input {
  justify-self: center;
}

.periods {
  display: flex;
  justify-content: space-evenly;
  flex-direction: column;
  align-items: flex-end;
  height: 100%;
}
</style>
