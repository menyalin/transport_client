<script setup>
import { computed, ref, watch } from 'vue'
import DatesRow from './DatesRow.vue'
import SelectorCard from './SelectorCard.vue'

const menu = ref(false)

defineOptions({
  name: 'DateRangeInput',
})
const props = defineProps({
  modelValue: {
    type: Array,
    default: () => [null, null],
  },
})
const emits = defineEmits(['update:model-value'])

const formattedPeriodDates = computed(() => {
  const [startDate, endDate] = props.modelValue
  return [
    startDate ? new Date(startDate).toLocaleDateString() : ' - ',
    endDate ? new Date(endDate).toLocaleDateString() : ' - ',
  ]
})

watch(menu, (val) => {
  if (!val) {
    const [startDate, endDate] = props.modelValue
    if (startDate && endDate && new Date(startDate) > new Date(endDate)) {
      emits('update:model-value', [endDate, startDate])
    }
  }
})
</script>
<template>
  <div class="date-range-wrapper">
    <div class="title-row">Выбор периода:</div>
    <DatesRow :formattedPeriodDates="formattedPeriodDates" id="menu-activator" />
    <v-menu v-model="menu" activator="#menu-activator" :close-on-content-click="false">
      <SelectorCard
        :model-value="modelValue"
        @update:model-value="emits('update:model-value', $event)"
        @period-selected="menu = false"
      />
    </v-menu>
  </div>
</template>

<style scoped>
.date-range-wrapper {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}
.title-row {
  font-size: small;
}
</style>
