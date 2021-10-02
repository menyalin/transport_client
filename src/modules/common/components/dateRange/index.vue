<template>
  <div class="date-range-wrapper">
    <div class="text-caption">
      Выбор периода
    </div>
    <div class="inputs-row">
      <v-menu
        v-model="startDateMenu"
        :close-on-content-click="false"
        transition="scale-transition"
        offset-y
        max-width="290px"
        min-width="auto"
      >
        <template v-slot:activator="{ on, attrs }">
          <span
            class="date-text"
            v-bind="attrs"
            v-on="on"
          >
            c:
            {{ startDate ? new Date(startDate).toLocaleDateString() : '-' }}
          </span>
        </template>
        <v-date-picker
          :value="startDate"
          no-title
          :max="endDate"
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
        <template v-slot:activator="{ on, attrs }">
          <span
            class="date-text"
            v-bind="attrs"
            v-on="on"
          >
            по:
            {{ endDate ? new Date(endDate).toLocaleDateString() : '-' }}
          </span>
        </template>
        <v-date-picker
          :value="endDate"
          no-title
          :disabled="!startDate"
          :min="startDate"
          color="primary"
          @change="changeEndDate"
          @input="endDateMenu = false"
        />
      </v-menu>
    </div>
  </div>
</template>
<script>
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
  },
  data() {
    return {
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
  methods: {
    changeStartDate(val) {
      this.$emit('change', [val, this.period[1]])
    },
    changeEndDate(val) {
      this.$emit('change', [this.period[0], val])
    },
  },
}
</script>
<style>
.date-range-wrapper {
  width: 300px;
}
.inputs-row {
  display: flex;
  flex-direction: row;
  justify-content: space-evenly;
  flex-wrap: nowrap;
}
</style>
