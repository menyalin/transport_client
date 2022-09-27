<template>
  <v-text-field
    :type="type"
    :disabled="disabled"
    :hide-details="hideDetails"
    :readonly="readonly"
    :dense="dense"
    :min="min"
    :outlined="outlined"
    :value="tmpDate"
    :error="Array.isArray(errorMessages) && errorMessages.length >= 1"
    @change="change"
    @click:prepend-inner="setDate"
  />
</template>
<script>
import dayjs from 'dayjs'

export default {
  name: 'DateTimeInput2',
  model: {
    prop: 'value',
    event: 'change',
  },

  props: {
    min: String, 
    max: String,
    value: {
      type: [String, Date],
    },
    type: {
      type: String,
      required: true,
      validator: function (value) {
        return ['date', 'datetime-local'].includes(value)
      }
    },
    label: String,
    hideDetails: {
      type: Boolean,
      default: false,
    },

    hidePrependIcon: {
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
  },
  data: () => ({    
    tmpDate: null,
  }),
  computed: {
    dateFormat() {
      if (this.type === 'datetime-local') return 'YYYY-MM-DDTHH:mm'
      return 'YYYY-MM-DD'
    }
  },
  watch: {
    value: {
      immediate: true,
      handler: function (val) {
        if (!val) return null
        this.tmpDate = dayjs(val).format(this.dateFormat)       
      },
    },
  },
  methods: {
    setDate() {
      if (this.readonly) return null
      this.dateValue = dayjs()
      this.emitValue()
    },

    emitValue() {
      this.$emit(
        'change',
        this.hideTimeInput
          ? this.dateValue?.format('YYYY-MM-DD')
          : this.dateValue?.format()
      )
    },

    change(dateStr) {
      if (this.min && new Date(dateStr) < new Date(this.min)) {
        this.innerErrorMessage = [`Дата должна быть больше ${new Date(this.min).toLocaleString()}`]
      } else {
        this.innerErrorMessage = []
        this.$emit('change', dayjs(dateStr).toISOString())
      }
      
    },
  
  },
}
</script>

