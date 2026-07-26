<template>
  <FormWrapper :loading="loading" :display-delete-btn="showDeleteBtn" @delete="deleteHandler">
    <DocsRegistryForm
      :item="item"
      :disabledPickOrders="disabledPickOrders"
      :disabledMainFields="disabledMainFields"
      @cancel="cancelHandler"
      @submit="submit"
      @save="submit($event, true)"
      @pickOrders="openDialog"
      @downloadXlsx="downloadWordHandler"
    />
    <DocsRegistryOrdersList
      :orders="item.orders"
      @delete="deleteOrderFromRegistry"
      @dblRowClick="dblRowClickHandler"
    />
    <v-dialog v-if="item._id" v-model="showPickOrderDialog" fullscreen persistent :scrim="false">
      <PickOrders :docsRegistry="item" :client="item.client" @cancel="closeDialog" />
    </v-dialog>
  </FormWrapper>
</template>

<script setup>
import { watch, ref, onBeforeUnmount, computed } from 'vue'
import socket from '@/socket'
import { useRouter } from 'vue-router'
import { useStore } from 'vuex'
import { DocsRegistryService } from '@/shared/services'
import { FormWrapper } from '@/shared/ui'
import { PickOrders, docsRegistryWordReport, DocsRegistryReportData } from '@/features/docsRegistry'
import { DocsRegistryForm, DocsRegistryOrdersList } from '@/entities/docsRegistry'
import { usePersistedRef } from '@/shared/hooks'

defineOptions({ name: 'DocsRegistryDetail' })
const props = defineProps({
  id: String,
})
const router = useRouter()
const vuexStore = useStore()

const item = ref({})

const showPickOrderDialog = usePersistedRef(false, 'docsRegistry:showPickOrderDialog')
const disabledPickOrders = computed(() => {
  return !item.value?._id
})

const disabledMainFields = computed(() => {
  return item.value.orders?.length > 0
})

const showDeleteBtn = computed(() => {
  return (
    !!props?.id &&
    vuexStore.getters.hasPermission('docsRegistry:delete') &&
    item.value?.orders &&
    item.value?.orders.length === 0
  )
})

async function deleteOrderFromRegistry(orders) {
  if (!orders || orders.length === 0) return null
  await DocsRegistryService.removeOrdersFromRegistry({
    orders,
    docsRegistryId: item.value._id,
  })
}

function openDialog() {
  showPickOrderDialog.value = true
}

function closeDialog() {
  showPickOrderDialog.value = false
}

const loading = ref(false)

async function getItem() {
  if (!props.id) return null
  try {
    loading.value = true
    const res = await DocsRegistryService.getById(props.id)
    item.value = res
  } catch (e) {
    vuexStore.commit('setError', e.message)
  } finally {
    loading.value = false
  }
}
const docsRegistryReportData = computed(() => new DocsRegistryReportData(item.value))

function downloadWordHandler() {
  docsRegistryWordReport(docsRegistryReportData.value)
}

const submit = async (formState, saveOnly) => {
  let updatedItem
  const itemId = props.id ? props.id : item.value?._id
  try {
    loading.value = true
    if (itemId) {
      updatedItem = await DocsRegistryService.updateOne(itemId, formState)
    } else {
      updatedItem = await DocsRegistryService.create(formState)
      router.replace('/accounting/docsRegistry/' + updatedItem._id)
    }
    if (!saveOnly) router.push('/accounting/docsRegistry')
    else {
      item.value = updatedItem
    }
  } catch (e) {
    vuexStore.commit('setError', e.message)
  } finally {
    loading.value = false
  }
}

async function deleteHandler() {
  try {
    if (props.id) {
      loading.value = true
      await DocsRegistryService.deleteById(props.id)
      router.push('/accounting/docsRegistry')
    } else return null
  } catch (e) {
    vuexStore.commit('setError', e.message)
  } finally {
    loading.value = false
  }
}

watch(() => props.id, getItem, { immediate: true, deep: true })

function dblRowClickHandler(orderId) {
  router.push('/orders/' + orderId)
}

function addOrders({ docsRegistry, orders }) {
  if (docsRegistry !== item.value._id) return null

  if (Array.isArray(item.value.orders)) item.value.orders.push(...orders)
  else item.value.orders = orders
}

function removeOrders({ docsRegistry, orders }) {
  if (docsRegistry !== item.value._id) return null
  item.value.orders = item.value.orders.filter((i) => !orders.includes(i.order._id))
}

socket.on('orders:addedToRegistry', addOrders)
socket.on('orders:removedFromRegistry', removeOrders)

onBeforeUnmount(() => {
  socket.off('orders:removedFromRegistry', removeOrders)
  socket.off('orders:addedToRegistry', addOrders)
})

function cancelHandler() {
  router.push({ name: 'DocsRegistryList' })
}
</script>

<style></style>
