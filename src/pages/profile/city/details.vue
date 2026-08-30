<template>
  <FormWrapper>
    <LoadSpinner v-if="loading" />
    <CityForm
      v-else
      :city="item"
      :displayDeleteBtn="!!props.id && $store.getters.hasPermission('city:delete')"
      @cancel="cancel"
      @submit="submit"
      @delete="deleteHandler"
    />
  </FormWrapper>
</template>
<script setup>
import { LoadSpinner, FormWrapper } from '@/shared/ui'
import { CityService } from '@/shared/services'
import { CityForm } from '@/features/city'
import { useReturnContextPage } from '@/shared/composables/useReturnContextPage'

defineOptions({ name: 'CityDetails' })

const props = defineProps({
  id: String,
})

const { item, loading, submit, cancel, deleteHandler } = useReturnContextPage(
  CityService,
  () => props.id,
  {
    returnContextField: 'newCityId',
    returnContextClearField: 'clearedCity',
    detailsRouteName: 'CityDetails',
  }
)
</script>
<style></style>
