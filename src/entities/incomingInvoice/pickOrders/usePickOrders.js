import usePersistedRef from '@/shared/hooks/usePersistedRef'
import store from '@/store'
import dayjs from 'dayjs'
import { ref, onMounted, computed, watch } from 'vue'
import { IncomingInvoiceService } from '@/shared/services'
import { headers } from './config/headers'
import { moneyFormatter } from '@/shared/utils/moneyFormatter'

const initPeriod = () => {
  return [
    dayjs().add(-2, 'month').startOf('month').format('YYYY-MM-DD'),
    dayjs().endOf('month').format('YYYY-MM-DD'),
  ]
}

export const usePickOrdersForIncomingInvoice = (props, _ctx) => {
  const loading = ref(false)
  const items = ref([])
  const selected = ref([])
  const selectedIds = computed(() => {
    return selected.value.map((i) => i._id)
  })
  const settings = usePersistedRef(
    { period: initPeriod(), docStatuses: ['accepted'] },
    'incomingInvoice:pickOrders:settings'
  )

  async function getData() {
    try {
      loading.value = true
      const data = await IncomingInvoiceService.pickOrders({
        ...settings.value,
        company: store.getters.directoriesProfile,
        agreement: props.agreementId,
        carrier: props.carrierId,
        limit: 100,
        skip: 0,
      })
      items.value = data.map((i) => ({
        ...i,
        price: {
          priceWithVat: moneyFormatter(i.price.priceWithVat, 2),
          priceWOVat: moneyFormatter(i.price.priceWOVat, 2),
        },
      }))
    } catch (e) {
      store.commit('setError', e.message)
    } finally {
      loading.value = false
    }
  }
  async function refresh() {
    await getData()
  }

  async function addOrderHandler() {
    try {
      loading.value = true
      if (selectedIds.value.length === 0) return null

      await IncomingInvoiceService.addOrdersToIncomingInvoice({
        orders: selectedIds.value,
        incomingInvoiceId: props.invoiceId,
      })
      selected.value = []
      await refresh()
    } catch (e) {
      store.commit('setError', e.message)
    } finally {
      loading.value = false
    }
  }

  onMounted(async () => {
    await getData()
  })

  watch(settings.value, async () => {
    await getData()
  })

  watch(selected, (items) => console.log(items.map((i) => i.clientNum)))

  return {
    loading,
    items,
    selected,
    settings,
    refresh,
    headers,
    selectedIds,
    addOrderHandler,
  }
}
