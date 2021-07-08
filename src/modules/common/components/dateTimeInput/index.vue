<template>
  <div>
    <div class="text-caption">{{ label }}</div>
    <div v-if="dateValue" class="text-h6">
      {{ dateValue.format('YYYY-MM-DD HH:mm') }}
    </div>
    <div class="input_wrapper">
      <v-text-field
        type="date"
        :value="dateStr"
        class="date-input"
        prepend-icon="mdi-arrow-right"
        @click:prepend="setDate"
        @change="changeDate"
      />
      <v-text-field
        v-if="!hideTimeInput"
        type="time"
        :value="timeStr"
        class="time-input"
        :disabled="timeInputDisabled"
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
    emit: 'change',
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
          if (val.trim()) {
            console.log('Не корректный формат даты')
            this.$store.commit('setError', 'Не корректный формат даты')
          }
        }
      },
    },
  },
  methods: {
    setDate() {
      this.dateValue = moment()
    },
    changeDate(dateStr) {
      if (dateStr) {
        this.fullTimeStr = this.dateValue?.format().split('T')[1]
        if (this.fullTimeStr)
          this.dateValue = moment(dateStr + 'T' + this.fullTimeStr)
        else this.dateValue = moment(dateStr)
      } else {
        this.dateValue = null
        this.fullTimeStr = '00:00'
      }
    },
    changeTime(timeStr) {
      let dateStr = this.dateValue.format(this.dateFormat)
      if (timeStr) {
        this.dateValue = moment(
          dateStr + 'T' + timeStr,
          moment.HTML5_FMT.DATETIME_LOCAL
        )
      }
    },
  },
}
</script>
<style scoped>
.input_wrapper {
  display: flex;
  flex-direction: row;
  flex-wrap: nowrap;
  max-width: 12rem;
}

.time-input {
  padding-left: 5px;
}
</style>
