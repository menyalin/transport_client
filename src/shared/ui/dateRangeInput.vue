<template>
  <div class="date-range-wrapper">
    <div class="text-caption">Выбор периода</div>
    <div class="inputs-row">
      <v-menu
        v-model="menu"
        :close-on-content-click="false"
        transition="scale-transition"
        offset-y
        max-width="290px"
        min-width="auto"
      >
        <template #activator="{ on, attrs }">
          <span class="date-text" v-bind="attrs" v-on="on">
            c:
            {{ tmpPeriod[0] ? new Date(tmpPeriod[0]).toLocaleDateString() : '-' }}
          </span>
          <span class="date-text" v-bind="attrs" v-on="on">
            по:
            {{ tmpPeriod[1] ? new Date(tmpPeriod[1]).toLocaleDateString() : '-' }}
          </span>
        </template>
        <v-date-picker
          v-model="tmpPeriod"
          no-title
          range
          :first-day-of-week="1"
          color="primary"
          @change="changeDate"
        />
      </v-menu>
    </div>
  </div>
</template>
<script>
import dayjs from 'dayjs'

export default {
  name: 'DateRange',
  model: {
    prop: 'value',
    event: 'change',
  },
  props: {
    value: {
      type: Array,
    },
    min: {
      type: String,
    },
  },
  data() {
    return {
      tmpPeriod: [null, null],
      menu: false,
    }
  },
  computed: {
    startDate() {
      return this.value && this.value[0] ? this.value[0] : null
    },
    endDate() {
      return this.value && this.value[1] ? this.value[1] : null
    },
  },
  watch: {
    value: {
      immediate: true,
      deep: true,
      handler: function (val) {
        this.tmpPeriod = val && val.length ? val : [null, null]
      },
    },
  },
  methods: {
    changeDate(val) {
      if (!val || val.length !== 2) return
      let tmpVal = val

      if (dayjs(val[1]).isBefore(val[0], 'day')) tmpVal.reverse()

      this.$emit('change', [
        dayjs(tmpVal[0]).startOf('day').toISOString(),
        dayjs(tmpVal[1]).endOf('day').toISOString(),
      ])
    },
  },
}
</script>
<style>
.date-range-wrapper {
  width: 280px;
}
.inputs-row {
  display: flex;
  flex-direction: row;
  justify-content: space-evenly;
  flex-wrap: nowrap;
}
.date-text {
  text-decoration: underline;
  text-decoration-color: blue;
}
</style>
