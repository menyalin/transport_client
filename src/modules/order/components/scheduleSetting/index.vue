<template>
  <div class="date-settings">
    <v-btn
      icon
      small
      :disabled="isMinDate"
      @click="incDate(-1)"
    >
      <v-icon>mdi-arrow-left-bold</v-icon>
    </v-btn>
    <app-date-time-input
      :value="date"
      hideDetails
      dense
      :minDate="minDate"
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
import dayjs from 'dayjs'
import AppDateTimeInput from '@/modules/common/components/dateTimeInput'
import PermissionService from '@/modules/common/services/permission.service'

export default {
  name: 'ScheduleSettings',
  components: {
    AppDateTimeInput,
  },
  computed: {
    date() {
      return this.$store.getters.scheduleDate
    },
    minDate() {
      return PermissionService.minAllowedDate({
        operation: 'order:daysForRead',
      })
    },
    isMinDate() {
      return dayjs(this.date).isSameOrBefore(this.minDate, 'day')
    },
  },
  methods: {
    incDate(count) {
      this.$store.commit('incScheduleDate', count)
    },
    setDate(date) {
      if (!date || dayjs(date).isBefore(this.minDate))
        this.$store.commit('setScheduleDate', dayjs().format('YYYY-MM-DD'))
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
