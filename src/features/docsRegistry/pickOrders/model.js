import store from '@/store'
import { ref, watch, computed } from 'vue'
import { DocsRegistryService } from '@/shared/services'

export const useListData = ({ client, _id }) => {
  if (!client) console.error('client id is missing')
  const historyState = window.history.state
  const initialState = { docsRegistryId: null, onlySelectable: true }
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
    client,
    docsRegistryId: _id,
    docStatus: settings.value.docStatus,
    truck: settings.value.truck,
    driver: settings.value.driver,
    onlySelectable: settings.value.onlySelectable,
  }))

  async function getData() {
    try {
      loading.value = true
      const data = await DocsRegistryService.pickOrders(queryParams.value)
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
