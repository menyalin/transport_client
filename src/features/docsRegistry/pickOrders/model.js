import store from '@/store'
import { ref, watch, computed } from 'vue'
import { DocsRegistryService } from '@/shared/services'

export const useListData = ({ client, docsRegistryId }) => {
  if (!client) console.error('client id is missing')
  const historyState = window.history.state
  const initialState = { docsRegistryId: null }
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
    docsRegistryId,
  }))

  async function getData() {
    try {
      loading.value = true
      const data = await DocsRegistryService.pickOrders(queryParams.value)
      items.value = data.items
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
