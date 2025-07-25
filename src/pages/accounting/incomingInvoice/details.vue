<template>
  <form-wrapper
    :loading="loading"
    :displayDeleteBtn="showDeleteBtn"
    @delete="deleteHandler"
    :itemIsMissing="item === null"
  >
    <IncomingInvoiceForm
      v-if="item"
      :item="item"
      :agreementItems="allCarrierAgreements"
      :disabledPickOrders="disabledPickOrders"
      :disabledMainFields="disabledMainFields"
      @submit="submit($event, false)"
      @save="submit($event, true)"
      @pickOrders="pickOrdersHandler"
      @savePayDate="savePayDateHandler"
    />
  </form-wrapper>
</template>

<script>
import { FormWrapper } from '@/shared/ui'
import { IncomingInvoiceForm } from '@/entities/incomingInvoice'
import { useItemData } from './model/useItemData.js'
import { useCarrierAgreements } from '@/entities/carrierAgreement'

export default {
  name: 'PaymentInvoiceDetails',
  components: {
    FormWrapper,
    IncomingInvoiceForm,
  },
  props: {
    id: String,
  },
  setup(props) {
    const { items: allCarrierAgreements } = useCarrierAgreements(props)
    const {
      item,
      disabledPickOrders,
      showDeleteBtn,
      disabledMainFields,
      loading,
      showError,
      errorMessage,
      submit,
      deleteHandler,
      deleteOrderFromPaymentInvoice,
      dblRowClickHandler,
      updateItemPrice,
      pickOrdersHandler,
      savePayDateHandler,
    } = useItemData(props)

    return {
      item,
      loading,
      showError,
      errorMessage,
      submit,
      deleteHandler,
      deleteOrderFromPaymentInvoice,
      showDeleteBtn,
      dblRowClickHandler,
      disabledPickOrders,
      disabledMainFields,
      updateItemPrice,
      allCarrierAgreements,
      pickOrdersHandler,
      savePayDateHandler,
    }
  },
  methods: {
    cancel() {
      this.$router.go(-1)
    },
  },
}
</script>

<style></style>
