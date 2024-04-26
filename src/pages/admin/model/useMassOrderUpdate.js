import { ref, computed, onMounted, onUnmounted, watch } from 'vue'
import socket from '@/socket'
import { v4 as uuidv4 } from 'uuid'
import store from '@/store'

export const useMassOrderUpdate = () => {
  const initialProcessingState = {
    isOrdersProcessing: false,
    totalCount: 0,
    ordersProcessed: 0,
    percent: 0,
  }
  const period = ref([])
  const uuid = ref(uuidv4())
  const company = ref(null)
  const ordersCount = ref(0)
  const updatingInterval = setInterval(getState, 500)
  const processingState = ref(initialProcessingState)

  const isFilledParams = computed(() => {
    return period.value?.length === 2 && company.value
  })

  const ordersSettings = computed(() => {
    return { period: period.value, company: company.value, key: uuid.value }
  })

  function getOrdersCountBtnHandler() {
    if (!isFilledParams.value) return
    socket.emit('mass_update_orders:get_orders_count', ordersSettings.value)
  }

  function getState() {
    socket.emit('mass_update_orders:get_orders_processing_state', uuid.value)
  }

  function runOrderProcessing() {
    if (!isFilledParams.value && ordersCount.value <= 0) return
    socket.emit(
      'mass_update_orders:run_orders_processing',
      ordersSettings.value
    )
  }

  function setOrdersCount({ count, key }) {
    if (uuid.value === key) ordersCount.value = count
  }

  function setProcessingState({ data, key }) {
    if (key === uuid.value) processingState.value = data
  }

  function cancelProcessing() {
    socket.emit('mass_update_orders:cancel_orders_processing')
  }

  function errorHandler(e) {
    store.commit('setError', e)
    console.log(e)
  }

  watch(ordersSettings, () => {
    ordersCount.value = 0
    processingState.value = initialProcessingState
  })

  onMounted(() => {
    socket.on('mass_update_orders:orders_count', setOrdersCount)
    socket.on('mass_update_orders:order_processing_state', setProcessingState)
    socket.on('mass_update_orders:processing_error', errorHandler)
  })

  onUnmounted(() => {
    socket.off('mass_update_orders:orders_count', setOrdersCount)
    socket.off('mass_update_orders:order_processing_state', setProcessingState)
    socket.off('mass_update_orders:processing_error', errorHandler)
    clearInterval(updatingInterval)
  })

  return {
    company,
    period,
    isFilledParams,
    getOrdersCountBtnHandler,
    ordersCount,
    runOrderProcessing,
    processingState,
    cancelProcessing,
  }
}
