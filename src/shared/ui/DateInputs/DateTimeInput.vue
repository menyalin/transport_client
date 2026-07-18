<script setup>
import { ref, computed, watch, useAttrs } from 'vue'
import dayjs from 'dayjs'
import { usePasteDateInput } from './usePasteDateInput.js'

const props = defineProps({
  modelValue: {
    type: [String, Date],
    default: null,
  },
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

const { readonly } = useAttrs()

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
  if (readonly) return
  emitValue(dayjs())
}

// const validateAndEmit = (dateStr) => {
//   if (!dateStr) {
//     emit('update:model-value', null)
//     tmpDate.value = null
//     return
//   }

//   const parsed = dayjs(dateStr)
//   if (!parsed.isValid()) {
//     return
//   }

//   if (min?.value && parsed.isBefore(dayjs(min.value))) {
//     innerErrorMessage.value = [
//       `Дата должна быть больше ${dayjs(min.value).format(dateFormat.value)}`,
//     ]
//     return
//   }

//   if (max?.value && parsed.isAfter(dayjs(max.value))) {
//     innerErrorMessage.value = [
//       `Дата должна быть меньше ${dayjs(max.value).format(dateFormat.value)}`,
//     ]
//     return
//   }

//   innerErrorMessage.value = []
//   const iso = parsed.toISOString()
//   tmpDate.value = parsed.format(dateFormat.value)
//   emit('update:model-value', iso)
// }
</script>

<template>
  <v-text-field
    v-bind="$attrs"
    class="d-inline-flex px-0"
    :type
    :prependInnerIcon="showPrependIcon ? 'mdi-chevron-right' : null"
    :model-value="tmpDate"
    :error-messages="errors"
    @paste="pasteDate"
    @update:model-value="emitValue"
    @click:prepend-inner="setCurrentDate"
  />
</template>
