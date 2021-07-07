<template>
  <div>
    <div class="text-caption">{{ label }}</div>
    <v-menu
      v-model="menu"
      :close-on-content-click="false"
      transition="scale-transition"
      offset-y
      max-width="290px"
      min-width="auto"
    >
      <template v-slot:activator="{ on, attrs }">
        <v-text-field
          hint="Введите дату в формате ДД.ММ.ГГГГ"
          prepend-icon="mdi-calendar"
          :value="dateValue"
          v-bind="attrs"
          v-on="on"
        ></v-text-field>
      </template>
      <v-date-picker v-model="dateValue" no-title @input="menu = false" />
    </v-menu>
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
  },
  data: () => ({
    menu: false,
    dateValue: null,
  }),
  watch: {
    value: {
      immediate: true,
      handler: function (val) {
        if (val && moment(val).isValid()) {
          this.dateValue = moment(val)
        } else this.dateValue = null
      },
    },
  },
  methods: {
    parseDate(str) {
      return moment(str)
    },
  },
}
</script>
<style></style>
