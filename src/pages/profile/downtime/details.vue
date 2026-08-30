<template>
  <FormWrapper>
    <v-alert v-model="error.show" closable type="error" @change="toggleAlert">
      {{ error.message }}
    </v-alert>
    <LoadSpinner v-if="loading" />
    <DowntimeForm
      v-else
      :downtime="item"
      :displayDeleteBtn="!!props.id && $store.getters.hasPermission('downtime:delete')"
      @cancel="cancel"
      @submit="submit"
      @delete="deleteHandler"
      @need-create-partner="onNeedCreatePartner"
      @need-edit-partner="onNeedEditPartner"
    />
  </FormWrapper>
</template>
<script setup>
import { useRoute, useRouter } from 'vue-router'
import { LoadSpinner, FormWrapper } from '@/shared/ui'
import { DowntimeService } from '@/shared/services'
import { usePageDetails } from '@/shared/hooks'
import { DowntimeForm } from '@/features/downtime'
import { pushContext } from '@/shared/composables/useReturnContext'

defineOptions({ name: 'DowntimeDetails' })

const props = defineProps({
  id: String,
  truckId: String,
  startDate: String,
})

const emit = defineEmits(['submit', 'cancel'])

const router = useRouter()
const route = useRoute()

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

function onNeedCreatePartner() {
  const ctxId = pushContext(route.path, 'pick-partner', { fieldName: 'partner' })
  router.push({ name: 'PartnerCreate', query: { ctx: ctxId } })
}

function onNeedEditPartner(id) {
  const ctxId = pushContext(route.path, 'edit-partner', { fieldName: 'partner', id })
  router.push({ name: 'PartnerDetails', params: { id }, query: { ctx: ctxId } })
}
</script>
<style></style>
