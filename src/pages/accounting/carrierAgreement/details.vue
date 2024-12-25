<template>
  <FormWrapper
    :loading="loading"
    :displayDeleteBtn="showDeleteBtn"
    @delete="deleteHandler"
    :itemIsMissing="itemIsMissing"
  >
    <CarrierAgreementForm
      :item="item"
      @submit="submit($event, false)"
      @save="submit($event, true)"
      @cancel="cancelHandler"
    />
  </FormWrapper>
</template>
<script>
import { FormWrapper } from '@/shared/ui'
import { CarrierAgreementForm } from '@/entities/carrierAgreement'
import { useItemData } from './useItemData'
import { computed } from 'vue'
export default {
  name: 'CarrierAgreementDetails',
  components: { FormWrapper, CarrierAgreementForm },
  props: {
    id: String,
  },
  setup(props, ctx) {
    const itemIsMissing = computed(() => props.id && item.value === null)

    const {
      item,
      showDeleteBtn,
      loading,
      showError,
      errorMessage,
      submit,
      deleteHandler,
      cancelHandler,
    } = useItemData(props, ctx)

    return {
      item,
      loading,
      showError,
      errorMessage,
      submit,
      deleteHandler,
      showDeleteBtn,
      cancelHandler,
      itemIsMissing,
    }
  },
}
</script>
<style></style>
