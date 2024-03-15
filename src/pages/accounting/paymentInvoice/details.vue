<template>
  <form-wrapper
    :loading="loading"
    @delete="deleteHandler"
    :displayDeleteBtn="showDeleteBtn"
  >
    <payment-invoice-form
      :item="item"
      @submit="submit($event, false)"
      :disabledPickOrders="disabledPickOrders"
      :disabledMainFields="disabledMainFields"
      @save="submit($event, true)"
      @pickOrders="openDialog"
      @download="downloadHandler"
      :disabledDownloadFiles="disabledDownloadFiles"
    />

    <payment-invoice-result :orders="item.orders" />

    <payment-invoice-orders-list
      :orders="item.orders"
      @delete="deleteOrderFromPaymentInvoice"
      @dblRowClick="dblRowClickHandler"
      @updateItemPrice="updateItemPrice"
    />

    <v-dialog
      v-if="item._id"
      v-model="showPickOrderDialog"
      fullscreen
      persistent
      hide-overlay
    >
      <pick-orders :paymentInvoice="item" @cancel="closeDialog" />
    </v-dialog>
  </form-wrapper>
</template>

<script>
import { ref, computed, watch, onBeforeUnmount } from 'vue'
import socket from '@/socket'
import router from '@/router'
import store from '@/store'
import { FormWrapper } from '@/shared/ui'
import {
  PaymentInvoiceForm,
  PaymentInvoiceOrdersList,
  PaymentInvoiceResult,
} from '@/entities/paymentInvoice'
import { PickOrders } from '@/features/paymentInvoice'
import { PaymentInvoiceService } from '@/shared/services'
import { useDownloadTemplate } from './model/useDownloadTemplate'

export default {
  name: 'PaymentInvoiceDetails',
  components: {
    FormWrapper,
    PaymentInvoiceForm,
    PickOrders,
    PaymentInvoiceOrdersList,
    PaymentInvoiceResult,
  },
  props: {
    id: String,
  },
  setup(props) {
    const item = ref({})
    const { downloadHandler } = useDownloadTemplate(item)

    const storedSettingsName = 'paymentInvoice:showPickOrderDialog'
    const showPickOrderDialog = ref(
      store.getters.storedValue(storedSettingsName) || false
    )
    const disabledPickOrders = computed(() => !item.value?._id)

    const needUpdateRows = computed(() =>
      item.value.orders.some((i) => i.needUpdate)
    )

    const disabledDownloadFiles = computed(
      () =>
        !item.value.orders ||
        item.value.orders.length === 0 ||
        needUpdateRows.value
    )
    const disabledMainFields = computed(() => {
      return item.value.orders?.length > 0
    })

    const showDeleteBtn = computed(() => {
      return (
        !!props?.id &&
        store.getters.hasPermission('paymentInvoice:delete') &&
        item.value?.orders &&
        item.value?.orders.length === 0
      )
    })

    async function deleteOrderFromPaymentInvoice(rowIds) {
      if (!rowIds || rowIds.length === 0) return null
      await PaymentInvoiceService.deleteOrdersFromPaymentInvoice({
        rowIds,
        paymentInvoiceId: item.value._id,
      })
    }

    function openDialog() {
      showPickOrderDialog.value = true
      store.commit('setStoredValue', { name: storedSettingsName, value: true })
    }

    function closeDialog() {
      showPickOrderDialog.value = false
      store.commit('setStoredValue', { name: storedSettingsName, value: false })
    }

    let loading = ref(false)
    const showError = ref(false)
    const errorMessage = ref('')

    async function getItem() {
      if (!props.id) return null
      try {
        loading.value = true
        const res = await PaymentInvoiceService.getById(props.id)
        item.value = { ...res }
        loading.value = false
      } catch (e) {
        loading.value = false
        store.commit('setError', e.message)
      }
    }

    async function submit(formState, saveOnly) {
      let updatedItem
      const itemId = props.id ? props.id : item.value?._id
      try {
        if (itemId) {
          updatedItem = await PaymentInvoiceService.updateOne(itemId, formState)
        } else {
          updatedItem = await PaymentInvoiceService.create(formState)
          if (saveOnly)
            router.replace({
              name: 'PaymentInvoiceDetail',
              params: { id: updatedItem._id },
            })
        }
        if (!saveOnly) {
          router.go(-1)
          //  router.push('/accounting/paymentInvoice')
        } else {
          item.value = updatedItem
        }
      } catch (e) {
        showError.value = true
        errorMessage.value = e.response.data
        store.commit('setError', e.message)
      }
    }

    async function deleteHandler() {
      try {
        if (props.id) {
          loading.value = true
          await PaymentInvoiceService.deleteById(props.id)
          router.push('/accounting/paymentInvoice')
          loading.value = false
        } else return null
      } catch (e) {
        loading.value = false
        showError.value = true
        errorMessage.value = e.response.data
        store.commit('setError', e.message)
      }
    }

    watch(() => props.id, getItem, { immediate: true, deep: true })

    function dblRowClickHandler(orderId) {
      router.push('/orders/' + orderId)
    }

    function addOrders({ paymentInvoiceId, orders }) {
      if (paymentInvoiceId !== item.value._id) return null

      if (Array.isArray(item.value.orders)) item.value.orders.push(...orders)
      else item.value.orders = orders
    }

    function removeOrders({ paymentInvoiceId, rowIds }) {
      if (paymentInvoiceId !== item.value._id) return null

      item.value.orders = item.value.orders.filter(
        (i) => !rowIds.includes(i.rowId)
      )
    }

    async function updateItemPrice(itemId) {
      // Обновить цены по рейсы в акте
      const res = await PaymentInvoiceService.updatePrices(itemId)
      const orderIdx = item.value.orders.findIndex((i) => itemId === i._id)
      item.value.orders.splice(orderIdx, 1, res)
    }

    socket.on('orders:addedToPaymentInvoice', addOrders)
    socket.on('orders:removedFromPaimentInvoice', removeOrders)

    onBeforeUnmount(() => {
      socket.off('orders:removedFromPaimentInvoice', removeOrders)
      socket.off('orders:addedToPaymentInvoice', addOrders)
    })

    return {
      item,
      loading,
      showError,
      errorMessage,
      submit,
      deleteHandler,
      showPickOrderDialog,
      openDialog,
      closeDialog,
      deleteOrderFromPaymentInvoice,
      showDeleteBtn,
      dblRowClickHandler,
      disabledPickOrders,
      disabledMainFields,
      disabledDownloadFiles,
      updateItemPrice,
      downloadHandler,
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
