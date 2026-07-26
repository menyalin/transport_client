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
import dayjs from 'dayjs'
import { useOrderStore } from '@/entities/order/orderStore'
import { PermissionService } from '@/shared/services'
import { DateTimeInput } from '@/shared/ui'

defineOptions({ name: 'ScheduleSettings' })

const orderStore = useOrderStore()

const date = computed(() => orderStore.scheduleDate)

const minDate = computed(() =>
  PermissionService.minAllowedDate({
    operation: 'order:daysForRead',
  })
)

const isMinDate = computed(() => dayjs(date.value).isSameOrBefore(minDate.value, 'day'))

function incDate(count) {
  orderStore.incScheduleDate(count)
}

function setDate(val) {
  if (!val || dayjs(val).isBefore(minDate.value))
    orderStore.setScheduleDate(dayjs().format('YYYY-MM-DD'))
  else orderStore.setScheduleDate(val)
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
