<template>
  <div class="date-settings">
    <v-btn icon size="small" :disabled="isMinDate" @click="incDate(-1)">
      <v-icon>mdi-arrow-left-bold</v-icon>
    </v-btn>
    <DateTimeInput
      :model-value="date"
      hide-details
      :min="minDate"
      @update:model-value="setDate"
      density="compact"
    />
    <v-btn icon size="small" @click="incDate(1)">
      <v-icon>mdi-arrow-right-bold</v-icon>
    </v-btn>
  </div>
</template>
<script setup>
import { computed } from 'vue'
import { useStore } from 'vuex'
import dayjs from 'dayjs'
import { PermissionService } from '@/shared/services'
import { DateTimeInput } from '@/shared/ui'

defineOptions({ name: 'ScheduleSettings' })

const store = useStore()

const date = computed(() => store.getters.scheduleDate)

const minDate = computed(() =>
  PermissionService.minAllowedDate({
    operation: 'order:daysForRead',
  })
)

const isMinDate = computed(() => dayjs(date.value).isSameOrBefore(minDate.value, 'day'))

function incDate(count) {
  store.commit('incScheduleDate', count)
}

function setDate(val) {
  if (!val || dayjs(val).isBefore(minDate.value))
    store.commit('setScheduleDate', dayjs().format('YYYY-MM-DD'))
  else store.commit('setScheduleDate', val)
}
</script>
<style scoped>
.date-settings {
  display: flex;
  flex-direction: row;
  align-items: flex-start;
  margin-left: 20px;
  gap: 12px;
}
</style>
