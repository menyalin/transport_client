<template>
  <form-wrapper
    :loading="loading"
    @delete="deleteHandler"
    :displayDeleteBtn="showDeleteBtn"
  >
    <payment-invoice-form
      :item="item"
      @submit="submit($event, false)"
      @save="submit($event, true)"
    />
  </form-wrapper>
</template>

<script>
import { ref, computed, watch } from 'vue'
// import socket from '@/socket'
import router from '@/router'
import store from '@/store'
import { FormWrapper } from '@/shared/ui'
import { PaymentInvoiceForm } from '@/entities/paymentInvoice'
import { PaymentInvoiceService } from '@/shared/services'

export default {
  name: 'PaymentInvoiceDetails',
  components: {
    FormWrapper,
    PaymentInvoiceForm,
  },
  props: {
    id: String,
  },
  setup(props) {
    const item = ref({})
    const storedSettingsName = 'paymentInvoice:showPickOrderDialog'
    const showPickOrderDialog = ref(
      store.getters.storedValue(storedSettingsName) || false
    )
    const disabledPickOrders = computed(() => {
      return !item.value?._id
    })

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

    // async function deleteOrderFromRegistry(orders) {
    //   if (!orders || orders.length === 0) return null
    //   await DocsRegistryService.removeOrdersFromRegistry({
    //     orders,
    //     docsRegistryId: item.value._id,
    //   })
    // }

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
    // const docsRegistryReportData = computed(
    //   () => new DocsRegistryReportData(item.value)
    // )

    // function downloadPdfHandler() {
    //   PdfMaker.download(
    //     docsRegistryPdfReport(docsRegistryReportData.value),
    //     docsRegistryReportData.value.fileNameStr
    //   )
    // }
    // function downloadWordHandler() {
    //   docsRegistryWordReport(docsRegistryReportData.value)
    // }

    async function submit(formState, saveOnly) {
      let updatedItem
      const itemId = props.id ? props.id : item.value?._id
      try {
        if (itemId) {
          updatedItem = await PaymentInvoiceService.updateOne(itemId, formState)
        } else {
          updatedItem = await PaymentInvoiceService.create(formState)
        }
        if (!saveOnly) router.push('/accounting/paymentInvoice')
        else {
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
          router.push('/accounting/paimentInvoice')
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

    // function dblRowClickHandler(orderId) {
    //   router.push('/orders/' + orderId)
    // }

    // function addOrders({ docsRegistry, orders }) {
    //   if (docsRegistry !== item.value._id) return null
    //   item.value.orders.push(...orders)
    // }

    // function removeOrders({ docsRegistry, orders }) {
    //   if (docsRegistry !== item.value._id) return null
    //   item.value.orders = item.value.orders.filter(
    //     (i) => !orders.includes(i.order._id)
    //   )
    // }

    // socket.on('orders:addedToRegistry', addOrders)
    // socket.on('orders:removedFromRegistry', removeOrders)

    // onBeforeUnmount(() => {
    //   socket.off('orders:removedFromRegistry', removeOrders)
    //   socket.off('orders:addedToRegistry', addOrders)
    // })

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
      // deleteOrderFromRegistry,
      showDeleteBtn,
      // dblRowClickHandler,
      disabledPickOrders,
      disabledMainFields,
      // downloadPdfHandler,
      // downloadWordHandler,
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
