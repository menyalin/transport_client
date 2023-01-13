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
        </template>
        <v-date-picker
          :value="tmpPeriod[0]"
          no-title
          :first-day-of-week="1"
          :max="tmpPeriod[1]"
          :min="min"
          color="primary"
          @change="changeStartDate"
          @input="startDateMenu = false"
        />
      </v-menu>
      <v-menu
        v-model="endDateMenu"
        :close-on-content-click="false"
        transition="scale-transition"
        offset-y
        max-width="290px"
        min-width="auto"
      >
        <template #activator="{ on, attrs }">
          <span class="date-text" v-bind="attrs" v-on="on">
            по:
            {{
              tmpPeriod[1] ? new Date(tmpPeriod[1]).toLocaleDateString() : '-'
            }}
          </span>
        </template>
        <v-date-picker
          :value="tmpPeriod[1]"
          no-title
          :first-day-of-week="1"
          :disabled="!tmpPeriod[0]"
          :min="tmpPeriod[0]"
          color="primary"
          @change="changeEndDate"
          @input="endDateMenu = false"
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
        this.tmpPeriod = [
          val[0] ? dayjs(val[0]).startOf('day').format() : null,
          val[1] ? dayjs(val[1]).endOf('day').format() : null,
        ]
      },
    },
  },
  methods: {
    changeStartDate(val) {
      this.$emit('change', [
        dayjs(val).startOf('day').format(),
        this.tmpPeriod[1],
      ])
    },
    changeEndDate(val) {
      this.$emit('change', [this.period[0], dayjs(val).endOf('day').format()])
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
