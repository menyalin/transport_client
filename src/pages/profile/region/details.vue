<template>
  <FormWrapper>
    <LoadSpinner v-if="loading" />
    <RegionForm
      v-else
      :region="item"
      :displayDeleteBtn="!!props.id && $store.getters.hasPermission('region:delete')"
      @cancel="cancel"
      @submit="submit"
      @delete="deleteHandler"
    />
  </FormWrapper>
</template>
<script setup>
import { LoadSpinner, FormWrapper } from '@/shared/ui'
import { RegionService } from '@/shared/services'
import { RegionForm } from '@/features/region'
import { useReturnContextPage } from '@/shared/composables/useReturnContextPage'

defineOptions({ name: 'RegionDetails' })

const props = defineProps({
  id: String,
})

const { item, loading, submit, cancel, deleteHandler } = useReturnContextPage(
  RegionService,
  () => props.id,
  {
    returnContextField: 'newRegionId',
    returnContextClearField: 'clearedRegion',
  }
)
</script>
<style></style>
