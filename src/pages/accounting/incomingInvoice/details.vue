<template>
  <FormWrapper
    :loading="loading"
    :display-delete-btn="showDeleteBtn"
    :item-is-missing="item === null"
    @delete="deleteHandler"
  >
    <IncomingInvoiceForm
      v-if="item"
      :item="item"
      :agreementItems="allCarrierAgreements"
      :outsourceCarriers="carrierStore.outsourceCarriers"
      :disabledPickOrders="disabledPickOrders"
      :disabledMainFields="disabledMainFields"
      @submit="submit($event, false)"
      @save="submit($event, true)"
      @pickOrders="pickOrdersHandler"
      @savePayDate="savePayDateHandler"
    />
  </FormWrapper>
</template>

<script setup>
import { FormWrapper } from '@/shared/ui'
import { IncomingInvoiceForm } from '@/entities/incomingInvoice'
import { useItemData } from './model/useItemData.js'
import { useCarrierAgreements } from '@/entities/carrierAgreement'
import { useCarrierStore } from '@/entities/carrier/useCarrierStore'

defineOptions({ name: 'PaymentInvoiceDetails' })

const props = defineProps({
  id: String,
})

const { items: allCarrierAgreements } = useCarrierAgreements(props)
const carrierStore = useCarrierStore()
const {
  item,
  disabledPickOrders,
  showDeleteBtn,
  disabledMainFields,
  loading,
  submit,
  deleteHandler,
  pickOrdersHandler,
  savePayDateHandler,
} = useItemData(props)
</script>

<style></style>
