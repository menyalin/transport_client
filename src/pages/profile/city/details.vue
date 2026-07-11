<template>
  <FormWrapper>
    <load-spinner v-if="loading" />
    <city-form
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
import { usePageDetails } from '@/shared/hooks'
import { CityForm } from '@/entities/city'
defineOptions({ name: 'CityDetails' })

const props = defineProps({
  id: String,
})

const emit = defineEmits(['submit', 'cancel'])

const { item, loading, submit, cancel, deleteHandler } = usePageDetails(
  CityService,
  () => props.id,
  { emit }
)
</script>
<style></style>
