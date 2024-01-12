import { ref, watch, computed } from 'vue'
import store from '@/store'
import router from '@/router'
import { PaymentInvoiceService } from '@/shared/services'
import useHistorySettings from '@/shared/hooks/useHistorySettings'

export const useListData = () => {
  function initialPeriod() {
    // TODO: сделать автовыбор периода
    return ['2023-12-01', '2023-12-31']
  }
  const initialState = { agreements: [], status: null, period: initialPeriod() }
  const settings = useHistorySettings(
    initialState,
    'paymentInvoice_list_settings'
  )

  const items = ref([])
  const totalCount = ref(0)
  const statisticData = ref({})
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
    statisticData,
    onDeleteHandler,
    totalCount,
  }
}
