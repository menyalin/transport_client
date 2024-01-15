import { ref, watch, computed } from 'vue'
import store from '@/store'
import router from '@/router'
import { PaymentInvoiceService } from '@/shared/services'
import useHistorySettings from '@/shared/hooks/useHistorySettings'
import dayjs from 'dayjs'

export const useListData = () => {
  function initialPeriod() {
    const startDate = dayjs().add(-1, 'month').startOf('month').toISOString()
    const endDate = dayjs().toISOString()
    return [startDate, endDate]
  }
  const initialState = { agreements: [], status: null, period: initialPeriod() }
  const settings = useHistorySettings(
    initialState,
    'paymentInvoice_list_settings'
  )

  const items = ref([])
  const totalCount = ref(0)
  const routesCount = ref(0)
  const total = ref({
    sum: 0,
    sumWOVat: 0,
  })

  const loading = ref(false)

  async function refresh() {
    await getData()
  }

  function create() {
    router.push('/accounting/paymentInvoice/create')
  }

  watch(
    settings,
    async () => {
      await getData()
    },
    { deep: true }
  )

  const queryParams = computed(() => ({
    period: settings.value?.period,
    status: settings.value?.status,
    search: settings.value?.search,
    agreements: settings.value?.agreements,
    company: store.getters.directoriesProfile,
    limit: settings.value?.listOptions?.itemsPerPage || 50,
    skip:
      settings.value.listOptions.itemsPerPage *
      (settings.value.listOptions.page - 1),
  }))

  async function getData() {
    try {
      loading.value = true
      const data = await PaymentInvoiceService.getList(queryParams.value)
      items.value = data.items
      totalCount.value = data.count
      routesCount.value = data.routesCount
      total.value = data.total
      loading.value = false
    } catch (e) {
      loading.value = false
      store.commit('setError', e.message)
    }
  }

  function onDeleteHandler(itemId) {
    items.value = items.value.filter((i) => i._id !== itemId)
  }

  return {
    refresh,
    create,
    settings,
    items,
    loading,
    total,
    onDeleteHandler,
    totalCount,
    routesCount,
  }
}
