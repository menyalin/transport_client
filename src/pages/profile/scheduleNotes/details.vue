<template>
  <FormWrapper>
    <LoadSpinner v-if="loading" />
    <ScheduleNoteForm
      v-else
      :scheduleNote="item"
      :displayDeleteBtn="!!props.id && $store.getters.hasPermission('scheduleNote:delete')"
      @cancel="cancel"
      @submit="submit"
      @delete="deleteHandler"
    />
  </FormWrapper>
</template>
<script setup lang="ts">
import { LoadSpinner, FormWrapper } from '@/shared/ui'
import { ScheduleNoteService } from '@/shared/services'
import { usePageDetails } from '@/shared/hooks'
import { ScheduleNoteForm } from '@/features/scheduleNote'

defineOptions({ name: 'ScheduleNoteDetails' })

interface Props {
  id?: string
  truckId?: string
  startDate?: string
}

const props = defineProps<Props>()

const emit = defineEmits<{
  submit: [id?: string]
  cancel: []
}>()

const { item, loading, submit, cancel, deleteHandler } = usePageDetails(
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
