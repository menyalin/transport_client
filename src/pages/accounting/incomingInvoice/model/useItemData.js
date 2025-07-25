import { ref, computed, watch, onBeforeUnmount, getCurrentInstance } from 'vue'
import store from '@/store'
import router from '@/router'
import socket from '@/socket'
import { IncomingInvoiceService } from '@/shared/services'

export const useItemData = (props) => {
  const { proxy } = getCurrentInstance()

  const item = ref({})
  let loading = ref(false)
  const showError = ref(false)
  const errorMessage = ref('')

  const disabledPickOrders = computed(() => !item.value?._id)

  const needUpdateRows = computed(() =>
    item.value.orders.some((i) => i.needUpdate)
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
    await IncomingInvoiceService.deleteOrderFromIncomingInvoice({
      rowIds,
      incomingInvoiceId: item.value._id,
    })
  }
  async function getItem() {
    if (!props.id) return null
    try {
      loading.value = true
      const res = await IncomingInvoiceService.getById(props.id)
      item.value = res
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
        updatedItem = await IncomingInvoiceService.updateOne(itemId, formState)
      } else {
        updatedItem = await IncomingInvoiceService.create(formState)
        if (saveOnly)
          router.replace({
            name: 'IncomingInvoiceDetail',
            params: { id: updatedItem._id },
          })
      }
      if (!saveOnly) {
        router.go(-1)
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
        await IncomingInvoiceService.deleteById(props.id)
        router.push('/accounting/incomingInvoice')
        loading.value = false
      } else return null
    } catch (e) {
      loading.value = false
      showError.value = true
      errorMessage.value = e.response.data
      store.commit('setError', e.message)
    }
  }
  function dblRowClickHandler(orderId) {
    router.push('/orders/' + orderId)
  }
  function pickOrdersHandler() {
    proxy.$router.push({
      name: 'PickOrdersForIncomingInvoice',
      params: {
        invoiceId: props.id,
        agreementId: item.value?.agreement,
        carrierId: item.value?.carrier,
      },
    })
  }

  async function savePayDateHandler(date) {
    try {
      loading.value = true
      const updatedItem = await IncomingInvoiceService.setPayDate(
        props.id,
        date
      )
      item.value = { ...item.value, ...updatedItem }
    } catch (e) {
      console.log('Ошибка при сохранении даты оплаты: ', e)
      proxy.$store.commit(
        'setError',
        `Ошибка при сохранении даты оплаты: ${e.message}`
      )
    } finally {
      loading.value = false
    }
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
    const res = await IncomingInvoiceService.updatePrices(itemId)
    const orderIdx = item.value.orders.findIndex((i) => itemId === i._id)
    item.value.orders.splice(orderIdx, 1, res)
  }
  watch(() => props.id, getItem, { immediate: true, deep: true })
  socket.on('orders:addedToIncomingInvoice', addOrders)
  socket.on('orders:removedFromIncomingInvoice', removeOrders)

  onBeforeUnmount(() => {
    socket.off('orders:removedFromIncomingInvoice', removeOrders)
    socket.off('orders:addedToIncomingInvoice', addOrders)
  })
  return {
    item,
    disabledPickOrders,
    needUpdateRows,
    disabledMainFields,
    showDeleteBtn,
    deleteOrderFromPaymentInvoice,
    getItem,
    submit,
    deleteHandler,
    dblRowClickHandler,
    updateItemPrice,
    pickOrdersHandler,
    savePayDateHandler,
  }
}
