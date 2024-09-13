<template>
  <v-text-field
    :label="label"
    :type="type"
    :disabled="disabled"
    :hide-details="!errors.length && hideDetails"
    :prepend-inner-icon="showPrependIcon ? 'mdi-chevron-right' : null"
    :readonly="readonly"
    :dense="dense"
    contenteditable
    :min="min"
    :max="max"
    :outlined="outlined"
    :value="tmpDate"
    :error="!!errors.length"
    :error-messages="errors"
    @paste="pasteDate"
    @change="change"
    @click:prepend-inner="setDate"
  />
</template>
<script setup lang="ts">
//@ts-nocheck
import dayjs from 'dayjs'
import { computed, ref, watch } from 'vue'

import { usePasteDateInput } from '@/modules/common/hooks/usePasteDateInput'
const emit = defineEmits(['change'])
const props = defineProps({
  min: String,
  max: String,
  value: {
    type: [String, Date],
  },
  type: {
    type: String,
    validator: function (value) {
      return ['date', 'datetime-local'].includes(value)
    },
    default: 'date',
  },
  label: String,
  hideDetails: {
    type: Boolean,
    default: false,
  },

  showPrependIcon: {
    type: Boolean,
    default: false,
  },

  errorMessages: {
    type: Array,
  },

  disabled: {
    type: Boolean,
    default: false,
  },

  dense: {
    type: Boolean,
    default: false,
  },
  readonly: {
    type: Boolean,
    default: false,
  },
  outlined: {
    type: Boolean,
    default: false,
  },
})

const tmpDate = ref(null)
const innerErrorMessage = ref([])

const { pasteDate } = usePasteDateInput()

const dateFormat = computed(() => {
  if (props.type === 'datetime-local') return 'YYYY-MM-DDTHH:mm'
  return 'YYYY-MM-DD'
})

const errors = computed(() => {
  if (props.errorMessages) return props.errorMessages
  else return innerErrorMessage.value
})

watch(
  () => props.value,
  (val) => {
    if (!val) return null
    tmpDate.value = dayjs(val).format(dateFormat.value)
  },
  { immediate: true }
)

const setDate = () => {
  if (props.readonly) return null
  emit('change', dayjs().toISOString())
}

const change = (dateStr) => {
  if (!dateStr) {
    emit('change', null)
    return
  }

  if (props.min && new Date(dateStr) < new Date(props.min)) {
    innerErrorMessage.value = [
      `Дата должна быть больше ${dayjs(props.min).format(dateFormat.value)}`,
    ]
  } else if (props.max && new Date(dateStr) > new Date(props.max)) {
    innerErrorMessage.value = [
      `Дата должна быть меньше ${dayjs(props.max).format(dateFormat.value)}`,
    ]
  } else {
    innerErrorMessage.value = []
    emit('change', dayjs(dateStr).toISOString())
  }
}
</script>
