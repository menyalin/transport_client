<template>
  <div class="date-settings">
    <v-btn
      icon
      small
      @click="incDate(-1)"
    >
      <v-icon>mdi-arrow-left-bold</v-icon>
    </v-btn>
    <app-date-time-input
      :value="date"
      hideDetails
      dense
      hideTimeInput
      hidePrependIcon
      @change="setDate"
    />
    <v-btn
      icon
      small
      @click="incDate(1)"
    >
      <v-icon>mdi-arrow-right-bold</v-icon>
    </v-btn>
  </div>
</template>
<script>
import moment from 'moment'
import AppDateTimeInput from '@/modules/common/components/dateTimeInput'
export default {
  name: 'ScheduleSettings',
  components: {
    AppDateTimeInput,
  },
  computed: {
    date() {
      return this.$store.getters.scheduleDate
    },
  },
  methods: {
    incDate(count) {
      this.$store.commit('incScheduleDate', count)
    },
    setDate(date) {
      if (!date)
        this.$store.commit('setScheduleDate', moment().format('YYYY-MM-DD'))
      else this.$store.commit('setScheduleDate', date)
    },
  },
}
</script>
<style scoped>
.date-settings {
  display: flex;
  flex-direction: row;
  align-items: center;
  margin-left: 20px;
}
</style>
