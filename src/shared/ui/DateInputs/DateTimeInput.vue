<script setup>
import { ref, computed, watch, useAttrs } from 'vue'
import dayjs from 'dayjs'
import { usePasteDateInput } from './usePasteDateInput'

const props = defineProps({
  modelValue: {
    type: [String, Date],
    default: null,
  },
  hideDetails: Boolean,
  type: {
    type: String,
    validator: (value) => ['date', 'datetime-local'].includes(value),
    default: 'date',
  },
  errorMessages: {
    type: Array,
    default: null,
  },
  showPrependIcon: {
    type: Boolean,
    default: false,
  },
})

const emit = defineEmits(['update:model-value'])

const attrs = useAttrs()

const { pasteDate } = usePasteDateInput()

const tmpDate = ref(null)
const innerErrorMessage = ref([])

const dateFormat = computed(() => {
  if (props.type === 'datetime-local') return 'YYYY-MM-DDTHH:mm'
  return 'YYYY-MM-DD'
})

const errors = computed(() => {
  return props.errorMessages || innerErrorMessage.value
})

// Синхронизация modelValue → tmpDate
watch(() => props.modelValue, syncInnerValue, { immediate: true })

function syncInnerValue(isoDate) {
  if (!isoDate || isoDate === 'Invalid Date') {
    tmpDate.value = null
  } else {
    const parsed = dayjs(isoDate)
    tmpDate.value = parsed.format(dateFormat.value)
  }
}
function emitValue(dateStr) {
  if (!dateStr) {
    emit('update:model-value', null)
    return
  }
  const parsedDate = dayjs(dateStr, dateFormat.value, true)
  if (parsedDate.isValid()) emit('update:model-value', parsedDate.toISOString())
}

const setCurrentDate = () => {
  if (attrs.readonly || !props.showPrependIcon) return
  emitValue(dayjs())
}
</script>

<template>
  <v-text-field
    v-bind="$attrs"
    class="d-inline-flex align-self-start px-3"
    :class="{ 'prepend-icon-hidden': !showPrependIcon }"
    :type
    :hide-details="!errors.length && props.hideDetails"
    prepend-inner-icon="mdi-chevron-right"
    :model-value="tmpDate"
    :error="!!errors.length"
    :error-messages="errors"
    @paste="pasteDate"
    @update:model-value="emitValue"
    @click:prepend-inner="setCurrentDate"
  />
</template>

<style scoped>
.prepend-icon-hidden :deep(.v-field__prepend-inner) {
  opacity: 0;
  pointer-events: none;
}
</style>
