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
import { ZoneForm } from '@/entities/zone'
import { LoadSpinner, FormWrapper } from '@/shared/ui'
import { ZoneService } from '@/shared/services'
import { usePageDetails } from '@/shared/hooks'

defineOptions({ name: 'ZoneDetails' })

const props = defineProps({
  id: String,
})

const emit = defineEmits(['submit', 'cancel'])

const { item, loading, submit, cancel, deleteHandler } = usePageDetails(
  ZoneService,
  () => props.id,
  { emit }
)
</script>
<style></style>
