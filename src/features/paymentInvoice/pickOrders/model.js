import store from '@/store'
import socket from '@/socket'
import dayjs from 'dayjs'
import { ref, watch, computed, onBeforeUnmount } from 'vue'
import { PaymentInvoiceService } from '@/shared/services'

const initPeriod = () => {
  return [
    dayjs().add(-1, 'month').startOf('month').toISOString(),
    new Date().toISOString(),
  ]
}

export const useListData = ({ client, _id, agreementId }) => {
  if (!client) console.error('client id is missing')
  const historyState = window.history.state
  const initialState = {
    search: null,
    paymentInvoiceId: null,
    onlySelectable: true,
    period: initPeriod(),
  }
  const settings = ref(historyState.settings || initialState)
  const items = ref([])
  const loading = ref(false)

  async function refresh() {
    await getData()
  }

  function resetSettings() {
    //reset settings
  }

  watch(
    settings,
    async () => {
      await getData()
      window.history.pushState({ settings: settings.value }, '')
    },
    { deep: true }
  )

  const queryParams = computed(() => ({
    period: settings.value.period,
    client,
    agreement: agreementId,
    paymentInvoiceId: _id,
    truck: settings.value.truck,
    search: settings.value.search,
    driver: settings.value.driver,
  }))

  async function getData() {
    try {
      loading.value = true
      const data = await PaymentInvoiceService.pickOrders(queryParams.value)
      items.value = data
      loading.value = false
    } catch (e) {
      loading.value = false
      store.commit('setError', e.message)
    }
  }

  addEventListener('popstate', (e) => {
    settings.value = e.state.settings
  })

  function updateItems(data) {
    if (!items.value) return null
    let order = items.value.find((item) => item._id === data._id)
    if (!order) return null
    order = Object.assign(order, data)
  }

  socket.on('order:updated', updateItems)
  onBeforeUnmount(() => {
    socket.off('order:updated', updateItems)
  })

  return {
    loading,
    resetSettings,
    refresh,
    settings,
    items,
  }
}
