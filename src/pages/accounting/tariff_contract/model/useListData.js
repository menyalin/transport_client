import { ref, watch, computed } from 'vue'
import store from '@/store'
import { useTariffContract } from '@/entities/tariff_contract'
import { usePersistedRef } from '@/shared/hooks'

export const useListData = () => {
  const loading = ref(false)
  const initialState = {
    agreements: [],
  }
  const settings = usePersistedRef(initialState, 'TariffContractList:settings')

  const listOptions = usePersistedRef(
    {
      page: 1,
      itemsPerPage: 50,
      sortBy: [],
      sortDesc: [],
    },
    'TariffContractList:listOptions'
  )
  const items = ref([])
  const count = ref(0)
  const { getList } = useTariffContract()

  async function setItems() {
    try {
      loading.value = true
      const res = await getList(queryParams.value)
      items.value = res.items
      count.value = res.count
    } catch (e) {
      store.commit('setError', e?.message || e)
    } finally {
      loading.value = false
    }
  }
  const queryParams = computed(() => ({
    skip: (listOptions.value.page - 1) * listOptions.value.itemsPerPage,
    limit: listOptions.value.itemsPerPage,
    sortBy: listOptions.value.sortBy,
    sortDesc: listOptions.value.sortDesc,
  }))

  async function refresh() {
    setItems()
  }
  function resetListOptions() {
    listOptions.value = { ...listOptions.value, page: 1 }
  }

  watch(listOptions, async () => {
    await setItems()
  })

  watch(settings, resetListOptions)

  return {
    loading,
    items,
    refresh,
    settings,
    listOptions,
  }
}
