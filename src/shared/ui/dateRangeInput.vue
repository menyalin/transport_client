<template>
  <div class="date-range-wrapper">
    <div class="text-caption">Выбор периода</div>
    <div class="inputs-row">
      <v-menu
        v-model="menu"
        :closeOnContentClick="false"
        maxWidth="290px"
        minWidth="auto"
      >
        <template v-slot:activator="{ props }">
          <span class="date-text" v-bind="props">
            c:
            {{ tmpPeriod[0] ? new Date(tmpPeriod[0]).toLocaleDateString() : '-' }}
          </span>
          <span class="date-text" v-bind="props">
            по:
            {{ tmpPeriod[1] ? new Date(tmpPeriod[1]).toLocaleDateString() : '-' }}
          </span>
        </template>
        <v-date-picker v-model="tmpPeriod" :firstDayOfWeek="1" color="primary" @update:model-value="changeDate" />
      </v-menu>
    </div>
  </div>
</template>
<script>
import dayjs from 'dayjs'

export default {
  name: 'DateRangeInput',
  props: {
    modelValue: {
      type: Array,
    },
    min: {
      type: String,
    },
  },
  emits: ['update:modelValue'],
  data() {
    return {
      tmpPeriod: [null, null],
      menu: false,
    }
  },
  computed: {
    startDate() {
      return this.modelValue && this.modelValue[0] ? this.modelValue[0] : null
    },
    endDate() {
      return this.modelValue && this.modelValue[1] ? this.modelValue[1] : null
    },
  },
  watch: {
    modelValue: {
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
      let tmpVal = val

      if (dayjs(val[1]).isBefore(val[0], 'day')) tmpVal.reverse()

      this.$emit('update:modelValue', [
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
