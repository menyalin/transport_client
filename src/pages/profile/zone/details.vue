<template>
  <FormWrapper>
    <LoadSpinner v-if="loading" />
    <ZoneForm
      v-else
      :zone="item"
      :displayDeleteBtn="!!props.id && $store.getters.hasPermission('zone:delete')"
      @cancel="cancel"
      @submit="submit"
      @delete="deleteHandler"
    />
  </FormWrapper>
</template>
<script setup>
import { LoadSpinner, FormWrapper } from '@/shared/ui'
import { ZoneService } from '@/shared/services'
import { ZoneForm } from '@/features/zone'
import { useReturnContextPage } from '@/shared/composables/useReturnContextPage'

defineOptions({ name: 'ZoneDetails' })

const props = defineProps({
  id: String,
})

const { item, loading, submit, cancel, deleteHandler } = useReturnContextPage(
  ZoneService,
  () => props.id,
  {
    returnContextField: 'newZoneId',
    returnContextClearField: 'clearedZone',
  }
)
</script>
<style></style>
