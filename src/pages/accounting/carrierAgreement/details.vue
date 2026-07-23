<template>
  <FormWrapper
    :loading="loading"
    :displayDeleteBtn="showDeleteBtn"
    :itemIsMissing="itemIsMissing"
    @delete="deleteHandler"
  >
    <CarrierAgreementForm
      :item="item"
      :allowUseCustomerRoleCarriers="carrierStore.allowUseCustomerRoleCarriers"
      @submit="submit($event, false)"
      @save="submit($event, true)"
      @cancel="cancelHandler"
    />
  </FormWrapper>
</template>

<script setup>
import { computed } from 'vue'
import { FormWrapper } from '@/shared/ui'
import { CarrierAgreementForm } from '@/entities/carrierAgreement'
import { useItemData } from './useItemData'
import { useCarrierStore } from '@/entities/carrier/useCarrierStore'

defineOptions({ name: 'CarrierAgreementDetails' })

const props = defineProps({
  id: String,
})

const carrierStore = useCarrierStore()
const itemIsMissing = computed(() => props.id && item.value === null)

const { item, showDeleteBtn, loading, submit, deleteHandler, cancelHandler } = useItemData(props)
</script>

<style></style>
