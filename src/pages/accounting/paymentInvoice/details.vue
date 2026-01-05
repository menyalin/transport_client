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
      :disabledDownloadFiles="disabledDownloadFiles"
      @save="submit($event, true)"
      @pickOrders="openDialog"
      @download="downloadHandler"
      @setDate="setDateHandler"
    />

    <!-- Лоадер для секции с заказами -->
    <v-card v-if="!loading" elevation="0" :loading="ordersLoading">
      <v-progress-linear v-if="ordersLoading" indeterminate color="primary" />

      <payment-invoice-result
        :orders="orders"
        :usePriceWithVat="item.usePriceWithVat"
        :vatRate="item.vatRate"
      />

      <payment-invoice-orders-list
        :orders="orders"
        :disabled="disabledPickOrders"
        @delete="deleteOrderFromPaymentInvoice"
        @dblRowClick="dblRowClickHandler"
        @updateItemPrice="updateItemPrice"
      />
    </v-card>

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

    // State для заказов с ОТДЕЛЬНЫМ лоадером
    const orders = ref([])
    const ordersLoading = ref(false)
    const ordersTotalCount = ref(0)
    const ordersError = ref(null)

    // Объединяем item и orders для useDownloadTemplate
    const invoiceWithOrders = computed(() => ({
      ...item.value,
      orders: orders.value,
    }))
    const { downloadHandler } = useDownloadTemplate(invoiceWithOrders)

    const storedSettingsName = 'paymentInvoice:showPickOrderDialog'
    const showPickOrderDialog = ref(
      store.getters.storedValue(storedSettingsName) || false
    )
    const disabledPickOrders = computed(
      () => !item.value?._id || item.value?.status !== 'inProcess'
    )

    const needUpdateRows = computed(() =>
      orders.value.some((i) => i.needUpdate)
    )

    const disabledDownloadFiles = computed(
      () => orders.value.length === 0 || needUpdateRows.value
    )
    const disabledMainFields = computed(() => {
      return item.value?.ordersCount > 0
    })

    const showDeleteBtn = computed(() => {
      return (
        !!props?.id &&
        store.getters.hasPermission('paymentInvoice:delete') &&
        orders.value.length === 0
      )
    })

    async function deleteOrderFromPaymentInvoice(rowIds) {
      if (!rowIds || rowIds.length === 0) return null
      await PaymentInvoiceService.deleteOrdersFromPaymentInvoice({
        rowIds,
        paymentInvoiceId: item.value._id,
      })
      // Socket событие обновит orders автоматически
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

    // Функция загрузки заказов
    async function loadInvoiceOrders(invoiceId) {
      if (!invoiceId) {
        orders.value = []
        ordersTotalCount.value = 0
        return
      }
      try {
        ordersLoading.value = true
        ordersError.value = null
        const res = await PaymentInvoiceService.getInvoiceOrders(invoiceId, {
          limit: 50,
        })
        orders.value = res.items || []
        ordersTotalCount.value = res.totalCount || 0
      } catch (e) {
        ordersError.value = e.message
        store.commit('setError', `Ошибка загрузки заказов: ${e.message}`)
        orders.value = []
        ordersTotalCount.value = 0
      } finally {
        ordersLoading.value = false
      }
    }

    async function getItem() {
      if (!props.id) return null
      try {
        loading.value = true
        const res = await PaymentInvoiceService.getById(props.id)
        item.value = { ...res }
        loading.value = false
        // Загружаем заказы ПОСЛЕ того как акт загружен
        await loadInvoiceOrders(props.id)
      } catch (e) {
        loading.value = false
        store.commit('setError', e.message)
      }
    }
    async function setDateHandler(params) {
      try {
        loading.value = true
        const res = await PaymentInvoiceService.setStatus(props.id, params)
        item.value = { ...item.value, ...res }
      } catch (e) {
        store.commit('setError', e.message)
      } finally {
        loading.value = false
      }
    }

    async function submit(formState, saveOnly) {
      let updatedItem
      const itemId = props.id ? props.id : item.value?._id
      try {
        loading.value = true
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
          // Загружаем заказы после сохранения нового акта
          if (updatedItem._id) {
            await loadInvoiceOrders(updatedItem._id)
          }
        }
      } catch (e) {
        showError.value = true
        errorMessage.value = e.response.data
        store.commit('setError', e.message)
      } finally {
        loading.value = false
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

    function addOrders({ paymentInvoiceId, orders: newOrders }) {
      if (paymentInvoiceId !== item.value._id) return null

      if (!Array.isArray(orders.value)) {
        orders.value = []
      }
      orders.value.push(...newOrders)
      // Обновить ordersCount в item
      item.value.ordersCount = orders.value.length
    }

    function removeOrders({ paymentInvoiceId, rowIds }) {
      if (paymentInvoiceId !== item.value._id) return null

      orders.value = orders.value.filter((i) => !rowIds.includes(i.rowId))
      // Обновить ordersCount в item
      item.value.ordersCount = orders.value.length
    }

    async function updateItemPrice(itemId) {
      // Обновить цены по рейсы в акте
      const res = await PaymentInvoiceService.updatePrices(itemId)
      const orderIdx = orders.value.findIndex((i) => itemId === i._id)
      if (orderIdx !== -1) {
        orders.value.splice(orderIdx, 1, res)
      }
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
      ordersLoading,
      orders,
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

      setDateHandler,
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
