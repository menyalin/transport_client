<template>
  <FormWrapper :loading="loading" :display-delete-btn="showDeleteBtn" @delete="deleteHandler">
    <PaymentInvoiceForm
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

      <PaymentInvoiceResult v-if="isExistedItem" :item="item" />

      <PaymentInvoiceOrdersList
        :orders="orders"
        :loading="ordersLoading"
        :ordersTotalCount="item.ordersCount"
        v-model:options="listOptions"
        :disabled="disabledPickOrders"
        @delete="deleteOrderFromPaymentInvoice"
        @dblRowClick="dblRowClickHandler"
        @updateItemPrice="updateItemPrice"
      />
    </v-card>

    <v-dialog v-if="item._id" v-model="showPickOrderDialog" fullscreen persistent :scrim="false">
      <PickOrders :paymentInvoice="item" @cancel="closeDialog" />
    </v-dialog>
  </FormWrapper>
</template>

<script setup>
import { ref, computed, watch, onBeforeUnmount } from 'vue'
import { useRouter } from 'vue-router'
import { useStore } from 'vuex'
import socket from '@/socket'
import { FormWrapper } from '@/shared/ui'
import { PickOrders, PaymentInvoiceForm } from '@/features/paymentInvoice'
import { PaymentInvoiceOrdersList, PaymentInvoiceResult } from '@/entities/paymentInvoice'
import { PaymentInvoiceService } from '@/shared/services'
import { useDownloadTemplate } from './model/useDownloadTemplate'
import { usePersistedRef } from '@/shared/hooks'

defineOptions({ name: 'PaymentInvoiceDetails' })

const props = defineProps({
  id: String,
})

const store = useStore()
const router = useRouter()

const item = ref({})
const listOptions = usePersistedRef({}, 'invoice_orders: ' + props.id)

const orders = ref([])
const ordersLoading = ref(false)

const isExistedItem = computed(() => Boolean(props.id))

const invoiceWithOrders = computed(() => ({
  ...item.value,
  orders: orders.value,
}))
const { downloadHandler } = useDownloadTemplate(invoiceWithOrders)

const storedSettingsName = 'paymentInvoice:showPickOrderDialog'
const showPickOrderDialog = ref(store.getters.storedValue(storedSettingsName) || false)
const disabledPickOrders = computed(() => !item.value?._id || item.value?.status !== 'inProcess')

const needUpdateRows = computed(() => {
  return orders.value?.some((i) => i && i.needUpdate)
})

const disabledDownloadFiles = computed(() => orders.value.length === 0 || needUpdateRows.value)
const disabledMainFields = computed(() => {
  return item.value?.ordersCount > 0
})

const showDeleteBtn = computed(() => {
  return (
    !!props?.id && store.getters.hasPermission('paymentInvoice:delete') && orders.value.length === 0
  )
})

async function deleteOrderFromPaymentInvoice(orderIds) {
  if (!orderIds || orderIds.length === 0) return null
  await PaymentInvoiceService.deleteOrdersFromPaymentInvoice({
    orderIds,
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

const loading = ref(false)

async function loadInvoiceOrders() {
  if (!listOptions.value.itemsPerPage) return
  const invoiceId = props.id
  if (!invoiceId) {
    orders.value = []
    return
  }
  try {
    ordersLoading.value = true
    orders.value = []
    const res = await PaymentInvoiceService.getInvoiceOrders(invoiceId, {
      limit: listOptions.value.itemsPerPage,
      skip: listOptions.value.itemsPerPage * (listOptions.value.page - 1),
    })
    orders.value = res.items || []
  } catch (e) {
    store.commit('setError', `Ошибка загрузки заказов: ${e.message}`)
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
  } catch (e) {
    store.commit('setError', e.message)
  } finally {
    loading.value = false
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
    } else {
      item.value = updatedItem
    }
  } catch (e) {
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
    store.commit('setError', e.message)
  }
}

watch(listOptions, loadInvoiceOrders, { deep: true })
watch(() => props.id, getItem, { immediate: true, deep: true })

function dblRowClickHandler(orderId) {
  router.push('/orders/' + orderId)
}

function setInvoiceAnalytic(total) {
  if (!item.value) return
  item.value = Object.assign(item.value, total)
}

function addOrders(payload) {
  if (payload.paymentInvoiceId !== item.value._id) return null

  setInvoiceAnalytic(payload.total)
  if (!Array.isArray(orders.value)) {
    orders.value = []
  }
  orders.value.push(...payload.orders)
}

function removeOrders({ paymentInvoiceId, orderIds, total }) {
  if (paymentInvoiceId !== item.value._id) return null
  setInvoiceAnalytic(total)
  orders.value = orders.value.filter((i) => !orderIds.includes(i._id))
}

async function updateItemPrice(itemId) {
  try {
    ordersLoading.value = true
    const res = await PaymentInvoiceService.updatePrices(itemId)

    if (!res.order) return

    const orderIdx = orders.value.findIndex((i) => itemId === i._id)
    if (orderIdx !== -1) {
      setInvoiceAnalytic(res.total)
      orders.value.splice(orderIdx, 1, res.order)
    }
  } catch (e) {
    console.log(e)
  } finally {
    ordersLoading.value = false
  }
}

socket.on('orders:addedToPaymentInvoice', addOrders)
socket.on('orders:removedFromPaimentInvoice', removeOrders)

onBeforeUnmount(() => {
  socket.off('orders:removedFromPaimentInvoice', removeOrders)
  socket.off('orders:addedToPaymentInvoice', addOrders)
})
</script>

<style></style>
