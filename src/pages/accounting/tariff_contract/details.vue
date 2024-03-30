<template>
  <form-wrapper
    :loading="loading"
    @delete="deleteHandler"
    :displayDeleteBtn="showDeleteBtn"
  >
    <TariffContractForm :agreements="agreementItems" />
  </form-wrapper>
</template>
<script>
import { ref } from 'vue'
import { FormWrapper } from '@/shared/ui'
import { TariffContractForm } from '@/entities/tariff_contract'
import { useAgreements } from '@/entities/agreement'
export default {
  name: 'TariffContractDetail',
  components: {
    FormWrapper,
    TariffContractForm,
  },
  setup() {
    const { allClientAgreements: agreementItems } = useAgreements()

    const loading = ref(false)
    const showDeleteBtn = ref(true)
    function deleteHandler() {
      console.log(deleteHandler)
    }
    return {
      loading,
      deleteHandler,
      showDeleteBtn,
      agreementItems,
    }
  },
}
</script>
