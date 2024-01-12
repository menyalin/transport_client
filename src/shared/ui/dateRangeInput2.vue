<template>
  <div class="date-range-wrapper">
    <div class="text-caption">Выбор периода</div>
    <div class="inputs-row">
      <v-menu
        v-model="startDateMenu"
        :close-on-content-click="false"
        transition="scale-transition"
        offset-y
        max-width="290px"
        min-width="auto"
      >
        <template #activator="{ on, attrs }">
          <span class="date-text" v-bind="attrs" v-on="on">
            c:
            {{
              tmpPeriod[0] ? new Date(tmpPeriod[0]).toLocaleDateString() : '-'
            }}
          </span>
          <span class="date-text" v-bind="attrs" v-on="on">
            по:
            {{
              tmpPeriod[1] ? new Date(tmpPeriod[1]).toLocaleDateString() : '-'
            }}
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
    prop: 'period',
    event: 'change',
  },
  props: {
    period: {
      type: Array,
    },
    min: {
      type: String,
    },
  },
  data() {
    return {
      tmpPeriod: [null, null],
      startDateMenu: false,
      endDateMenu: false,
    }
  },
  computed: {
    startDate() {
      return this.period && this.period[0] ? this.period[0] : null
    },
    endDate() {
      return this.period && this.period[1] ? this.period[1] : null
    },
  },
  watch: {
    period: {
      immediate: true,
      deep: true,
      handler: function (val) {
        this.tmpPeriod = val
      },
    },
  },
  methods: {
    changeDate(val) {
      if (!val || val.length !== 2) return

      this.$emit('change', [
        dayjs(val[0]).startOf('day').toISOString(),
        dayjs(val[1]).endOf('day').toISOString(),
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
