import { ref, watch, computed } from 'vue'
import { DocsRegistryService } from '@/shared/services'
import { usePersistedRef } from '@/shared/hooks'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'

export const useListData = () => {
  const vuexStore = useStore()
  const router = useRouter()
  const initialState = { clients: [], status: null }
  const settings = usePersistedRef(initialState, 'docsRegistryList:settings')
  const listOptions = usePersistedRef({ page: 1, itemsPerPage: 25 }, 'docsRegistryList:listOptions')
  const items = ref([])
  const totalCount = ref(0)
  const statisticData = ref({})
  const loading = ref(false)

  async function refresh() {
    await getData()
  }

  function create() {
    router.push('/accounting/docsRegistry/create')
  }

  watch(
    settings,
    () => {
      updateListOptionsHandler({ page: 1 })
    },
    { deep: true }
  )

  async function updateListOptionsHandler(options) {
    listOptions.value = { ...listOptions.value, ...options }
    await getData()
  }

  const queryParams = computed(() => ({
    ...settings.value,
    company: vuexStore.getters.directoriesProfile,
    limit: listOptions.value.itemsPerPage,
    skip: listOptions.value.itemsPerPage * (listOptions.value.page - 1),
  }))

  async function getData() {
    try {
      loading.value = true
      const data = await DocsRegistryService.getList(queryParams.value)
      items.value = data.items || []
      totalCount.value = data.count || 0
      loading.value = false
    } catch (e) {
      loading.value = false
      vuexStore.commit('setError', e.message)
    }
  }

  function onDeleteHandler(itemId) {
    items.value = items.value.filter((i) => i._id !== itemId)
  }

  return {
    items,
    settings,
    listOptions,
    loading,
    statisticData,
    totalCount,
    refresh,
    create,
    onDeleteHandler,
    updateListOptionsHandler,
  }
}
