import store from '@/store'
import socket from '@/socket'
import dayjs from 'dayjs'
import { ref, watch, computed, onBeforeUnmount } from 'vue'
import { PaymentInvoiceService } from '@/shared/services'
import { usePersistedRef } from '@/shared/hooks'

const initPeriod = () => {
  return [dayjs().add(-1, 'month').startOf('month').toISOString(), new Date().toISOString()]
}

export const useListData = ({ client, _id, agreementId }) => {
  if (!client) console.error('client id is missing')
  const initialState = {
    search: null,
    paymentInvoiceId: null,
    onlySelectable: true,
    period: initPeriod(),
    docStatuses: ['accepted'],
    loadingZones: [],
  }
  const settings = usePersistedRef(initialState, 'paymentInvoice:pickOrders:settings')
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
    docStatuses: settings.value.docStatuses,
    loadingZones: settings.value.loadingZones,
  }))

  async function getData() {
    try {
      loading.value = true
      const [orders] = await PaymentInvoiceService.pickOrders(queryParams.value)
      items.value = orders
      loading.value = false
    } catch (e) {
      loading.value = false
      store.commit('setError', e.message)
    }
  }

  function updateItems(data) {
    if (!items.value) return null
    let order = items.value.find(item => item._id === data._id)
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
