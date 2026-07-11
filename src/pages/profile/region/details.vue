<template>
  <FormWrapper>
    <load-spinner v-if="loading" />
    <region-form
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
import { usePageDetails } from '@/shared/hooks'
import { RegionForm } from '@/entities/region'

defineOptions({ name: 'RegionDetails' })

const props = defineProps({
  id: String,
})

const emit = defineEmits(['submit', 'cancel'])

const { item, loading, submit, cancel, deleteHandler } = usePageDetails(
  RegionService,
  () => props.id,
  { emit }
)
</script>
<style></style>
