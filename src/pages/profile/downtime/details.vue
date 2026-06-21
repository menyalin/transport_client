<template>
  <v-container fluid>
    <v-row>
      <v-col>
        <v-alert v-model="error.show" closable type="error" @change="toggleAlert">
          {{ error.message }}
        </v-alert>
        <load-spinner v-if="loading" />
        <DowntimeForm
          v-else
          :downtime="item"
          :displayDeleteBtn="!!props.id && $store.getters.hasPermission('downtime:delete')"
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
import { DowntimeService } from '@/shared/services'
import { usePageDetails } from '@/shared/hooks'
import { DowntimeForm } from '@/entities/downtime'

defineOptions({ name: 'DowntimeDetails' })

const props = defineProps({
  id: String,
  truckId: String,
  startDate: String,
})

const emit = defineEmits(['submit', 'cancel'])

const { item, loading, error, toggleAlert, submit, cancel, deleteHandler } = usePageDetails(
  DowntimeService,
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
