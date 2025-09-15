<template>
  <v-text-field
    v-bind="$attrs"
    :type="type"
    :disabled="disabled"
    :hide-details="!errors.length && hideDetails"
    :prepend-inner-icon="showPrependIcon ? 'mdi-chevron-right' : null"
    :readonly="readonly"
    contenteditable
    :min="min"
    :max="max"
    :model-value="tmpDate"
    :error="!!errors.length"
    :error-messages="errors"
    @paste="pasteDate"
    @update:model-value="change"
    @click:prepend-inner="setDate"
  />
</template>
<script>
import dayjs from 'dayjs'
import { usePasteDateInput } from './usePasteDateInput.js'

export default {
  name: 'DateTimeInput',
  model: {
    prop: 'value',
    event: 'change',
  },
  setup() {
    const { pasteDate } = usePasteDateInput()
    return { pasteDate }
  },
  props: {
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
  },
  data: () => ({
    tmpDate: null,
    innerErrorMessage: [],
  }),
  computed: {
    dateFormat() {
      if (this.type === 'datetime-local') return 'YYYY-MM-DDTHH:mm'
      return 'YYYY-MM-DD'
    },
    errors() {
      if (this.errorMessages) return this.errorMessages
      else return this.innerErrorMessage
    },
  },
  watch: {
    value: {
      immediate: true,
      deep: true,
      handler: function (val) {
        if (!val) {
          this.tmpDate = null
          return
        }
        this.tmpDate = dayjs(val).format(this.dateFormat)
      },
    },
  },
  methods: {
    setDate() {
      if (this.readonly) return null
      this.$emit('change', dayjs().toISOString())
    },

    change(dateStr) {
      if (!dateStr) {
        this.$emit('change', null)
        return
      }

      if (this.min && new Date(dateStr) < new Date(this.min)) {
        this.innerErrorMessage = [
          `Дата должна быть больше ${dayjs(this.min).format(this.dateFormat)}`,
        ]
      } else if (this.max && new Date(dateStr) > new Date(this.max)) {
        this.innerErrorMessage = [
          `Дата должна быть меньше ${dayjs(this.max).format(this.dateFormat)}`,
        ]
      } else {
        this.innerErrorMessage = []
        this.$emit('change', dayjs(dateStr).toISOString())
      }
    },
  },
}
</script>
