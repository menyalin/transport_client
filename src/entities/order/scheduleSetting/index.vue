<template>
  <div class="date-settings">
    <v-btn icon size="small" :disabled="isMinDate" @click="incDate(-1)">
      <v-icon>mdi-arrow-left-bold</v-icon>
    </v-btn>
    <DateTimeInput
      :value="date"
      hideDetails
      density="compact"
      :minDate="minDate"
      hideTimeInput
      hidePrependIcon
      @update:model-value="setDate"
    />
    <v-btn icon size="small" @click="incDate(1)">
      <v-icon>mdi-arrow-right-bold</v-icon>
    </v-btn>
  </div>
</template>
<script>
import dayjs from 'dayjs'
import { PermissionService } from '@/shared/services'
import { DateTimeInput } from '@/shared/ui'

export default {
  name: 'ScheduleSettings',
  components: {
    DateTimeInput,
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
  gap: 12px;
}
</style>
