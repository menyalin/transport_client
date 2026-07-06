<template>
  <FormWrapper>
    <CarrierForm
      :loading="carrierStore.loading"
      @submit="submitHandler"
      @cancel="cancelHandler"
      :agreementItems="carrierAgreements"
    />
  </FormWrapper>
</template>
<script setup>
import { useRouter } from 'vue-router'
import { CarrierForm } from '@/entities/carrier'
import { useCarrierStore } from '@/entities/carrier/useCarrierStore'
import { useCarrierAgreements } from '@/entities/carrierAgreement'
import { FormWrapper } from '@/shared/ui'

defineOptions({ name: 'CarrierCreatePage' })

const router = useRouter()
const carrierStore = useCarrierStore()
const { items: carrierAgreements } = useCarrierAgreements()

async function submitHandler(carrier) {
  await carrierStore.create(carrier)
  router.push({ name: 'CarrierList' })
}

async function cancelHandler() {
  router.push({ name: 'CarrierList' })
}
</script>
<style></style>
