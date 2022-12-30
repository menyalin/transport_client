import { ref, watch, computed } from 'vue'
import store from '@/store'
import router from '@/router'
import { DocsRegistryService as service } from '@/shared/services'

const useListData = () => {
  const historyState = window.history.state
  const initialState = { clients: [], status: null }
  const headers = ref([])
  const settings = ref(historyState.settings || initialState)
  const items = ref([])

  function changeHeaders(value) {
    headers.value = value
  }

  async function refresh() {
    await getData()
  }

  function create() {
    router.push('/accounting/docsRegistry/create')
  }

  watch(settings, async () => {
    await getData()
    window.history.pushState({ settings: settings.value }, '')
  })

  const queryParams = computed(() => ({
    status: settings.value?.status,
    clients: settings.value?.clients,
    company: store.getters.directoriesProfile,
    limit: settings.value?.listOptions?.itemsPerPage || 50,
    skip: 0,
  }))

  async function getData() {
    const data = await service.getList(queryParams.value)
    items.value = data.items
  }

  addEventListener('popstate', (e) => {
    settings.value = e.state.settings
  })

  return {
    refresh,
    create,
    settings,
    changeHeaders,
    headers,
    items,
  }
}

export default useListData
