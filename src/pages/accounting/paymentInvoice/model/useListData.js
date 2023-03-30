import { ref, watch, computed } from 'vue'
import store from '@/store'
import router from '@/router'
import { PaymentInvoiceService } from '@/shared/services'

export const useListData = () => {
  const historyState = window.history.state
  const initialState = { clients: [], status: null }
  const settings = ref(historyState.settings || initialState)
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
      window.history.pushState({ settings: settings.value }, '')
    },
    { deep: true }
  )

  const queryParams = computed(() => ({
    status: settings.value?.status,
    clients: settings.value?.clients,
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

  addEventListener('popstate', (e) => {
    settings.value = e.state.settings
  })

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
