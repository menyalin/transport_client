import store from '@/store'
import dayjs from 'dayjs'
import { ref, watch, computed } from 'vue'
import { PaymentInvoiceService } from '@/shared/services'

const initPeriod = () => {
  return [
    dayjs().add(-1, 'month').startOf('month').toISOString(),
    new Date().toISOString(),
  ]
}

export const useListData = ({ client, _id }) => {
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
    paymentInvoiceId: _id,
    truck: settings.value.truck,
    search: settings.value.search,
    driver: settings.value.driver,
    // docStatus: settings.value.docStatus,
    // onlySelectable: settings.value.onlySelectable,
    // loadingZone: settings.value.loadingZone,
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

  return {
    loading,
    resetSettings,
    refresh,
    settings,
    items,
  }
}
