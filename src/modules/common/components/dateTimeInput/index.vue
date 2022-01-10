<template>
  <div>
    <div
      class="input_wrapper_row"
      @blur="$emit('blur')"
    >
      <v-text-field
        type="date"
        :min="minDateValue"
        :label="label"
        :dense="dense"
        :value="dateStr"
        :error="Array.isArray(errorMessages) && errorMessages.length >= 1"
        class="date-input pt-0 mt-0"
        :prepend-inner-icon="!hidePrependIcon ? 'mdi-chevron-right' : null"
        :outlined="outlined"
        :disabled="disabled"
        :readonly="readonly"
        :hide-details="hideDetails"
        @click:prepend-inner="setDate"
        @change="changeDate"
      />
      <v-text-field
        v-if="!hideTimeInput"
        type="time"
        :value="timeStr"
        :error="Array.isArray(errorMessages) && errorMessages.length >= 1"
        class="time-input pt-0 mt-0"
        :hide-details="hideDetails"
        :readonly="readonly"
        :disabled="timeInputDisabled || disabled"
        :dense="dense"
        label="Время"
        :outlined="outlined"
        @change="changeTime"
      />
    </div>
    <div
      v-if="errorMessages && errorMessages.length"
      class="text-caption px-5 red--text text-center"
    >
      {{ errorMessages.join(', ') }}
    </div>
  </div>
</template>
<script>
import moment from 'moment'

export default {
  name: 'DateTimeInput',
  model: {
    prop: 'value',
    event: 'change',
  },

  props: {
    value: {
      type: [String, Date],
    },
    dense: {
      type: Boolean,
      default: true,
    },
    hideDetails: {
      type: Boolean,
      default: true,
    },
    readonly: {
      type: Boolean,
      default: false,
    },
    label: {
      type: String,
    },
    hideTimeInput: {
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
    outlined: {
      type: Boolean,
      default: true,
    },
    minDate: {
      type: String,
      default: null,
    },
  },
  data: () => ({
    dateFormat: 'YYYY-MM-DD',
    timeFormat: 'HH:mm',
    date: null,
    dateValue: null,
    fullTimeStr: null,
  }),
  computed: {
    dateStr() {
      if (this.dateValue) return this.dateValue.format(this.dateFormat)
      else return null
    },
    timeStr() {
      if (this.dateValue) return this.dateValue.format(this.timeFormat)
      else return null
    },
    timeInputDisabled() {
      if (!this.dateValue) return true
      return !this.dateValue?.isValid()
    },
    minDateValue() {
      if (!this.minDate) return null
      return moment(this.minDate).format('YYYY-MM-DD')
    },
  },
  watch: {
    value: {
      immediate: true,
      handler: function (val) {
        if (val?.trim() && moment(val.trim()).isValid()) {
          this.dateValue = moment(val.trim())
        } else {
          this.dateValue = null
          if (val?.trim()) {
            this.$store.commit('setError', 'Не корректный формат даты')
          }
        }
      },
    },
  },
  methods: {
    setDate() {
      if (this.readonly) return null
      this.dateValue = moment()
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
    changeDate(dateStr) {
      if (dateStr && moment(dateStr).isValid()) {
        this.fullTimeStr = this.dateValue?.format().split('T')[1]
        if (this.fullTimeStr)
          this.dateValue = moment(dateStr + 'T' + this.fullTimeStr)
        else this.dateValue = moment(dateStr)
        this.emitValue()
      } else {
        this.dateValue = null
        this.fullTimeStr = null
        this.$emit('change', null)
      }
    },
    changeTime(timeStr) {
      let dateStr = this.dateValue.format(this.dateFormat)
      this.dateValue = moment(
        dateStr + 'T' + timeStr || '00:00',
        moment.HTML5_FMT.DATETIME_LOCAL
      )
      this.emitValue()
    },
  },
}
</script>
<style scoped>
.input_wrapper_row {
  width: 20rem;
  display: flex;

  flex-direction: row;
  flex-wrap: nowrap;
  width: 100%;
}

.time-input {
  padding-left: 1px;
  max-width: 6rem;
}

.date-input {
  max-width: 13rem;
}
</style>
