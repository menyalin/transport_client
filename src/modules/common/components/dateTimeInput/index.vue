<template>
  <div>
    <div class="input_wrapper">
      <v-text-field
        type="date"
        :label="label"
        :value="dateStr"
        class="date-input pt-0 mt-0"
        :prepend-icon="!hidePrependIcon ? 'mdi-arrow-right' : null"
        :error-messages="errorMessages"
        outlined
        dense
        @click:prepend="setDate"
        @change="changeDate"
      />
      <v-text-field
        v-if="!hideTimeInput"
        type="time"
        :value="timeStr"
        class="time-input"
        :disabled="timeInputDisabled"
        dense
        outlined
        @change="changeTime"
      />
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
        this.emitValue()
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
.input_wrapper {
  display: flex;
  flex-direction: row;
  flex-wrap: nowrap;
  max-width: 14rem;
  min-width: 12rem;
}

.time-input {
  padding-left: 5px;
}
</style>
