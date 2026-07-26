<template>
  <v-container fluid>
    <v-row>
      <v-col>
        <v-alert v-model="error.show" closable type="error" @update:model-value="toggleAlert">
          {{ error.message }}
        </v-alert>
        <LoadSpinner v-if="loading" />
        <ScheduleNoteForm
          v-else
          :scheduleNote="item"
          :displayDeleteBtn="!!props.id && $store.getters.hasPermission('scheduleNote:delete')"
          @cancel="cancel"
          @submit="submit"
          @delete="deleteHandler"
        />
      </v-col>
    </v-row>
  </v-container>
</template>
<script setup>
import { LoadSpinner } from '@/shared/ui'
import { ScheduleNoteService } from '@/shared/services'
import { usePageDetails } from '@/shared/hooks'
import { ScheduleNoteForm } from '@/features/scheduleNote'

defineOptions({ name: 'ScheduleNoteDetails' })

const props = defineProps({
  id: String,
  truckId: String,
  startDate: String,
})

const emit = defineEmits(['submit', 'cancel'])

const { item, loading, error, toggleAlert, submit, cancel, deleteHandler } = usePageDetails(
  ScheduleNoteService,
  () => props.id,
  { emit }
)

if (props.startDate) {
  item.value = {
    startPositionDate: props.startDate,
    truck: props.truckId,
  }
}
</script>
<style></style>
