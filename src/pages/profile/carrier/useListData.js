import { computed, watch, ref, getCurrentInstance } from 'vue'
import usePersistedRef from '@/shared/hooks/usePersistedRef'
import { CarrierService } from '@/shared/services'

export const useListData = () => {
  const { proxy } = getCurrentInstance()
  const headers = computed(() => [
    { value: 'name', text: 'Название ТК' },
    { value: 'outsource', text: 'Привлеченный', width: 150, align: 'center' },
    { value: 'agreements', text: 'Соглашения' },
  ])
  const settings = usePersistedRef(
    { search: null, type: 'all' },
    'CarrierListSettings'
  )
  const items = ref([])
  const loading = ref(false)
  const count = ref(0)
  const listOptions = usePersistedRef(
    { itemsPerPage: 50, page: 1 },
    'CarrierList:listOptions'
  )

  const queryParams = computed(() => ({
    company: proxy.$store.getters.directoriesProfile,
    search: settings.value?.search,
    type: settings.value?.type,
    limit: listOptions.value?.itemsPerPage || 50,
    skip: listOptions.value?.itemsPerPage * (listOptions.value?.page - 1) || 0,
    sortBy: listOptions.value?.sortBy || [],
    sortDesc: listOptions.value?.sortDesc || [],
  }))

  async function getItems() {
    try {
      loading.value = true
      const res = await CarrierService.getList(queryParams.value)
      items.value = res.items ?? []
      count.value = res.count ?? 0
    } catch (e) {
      proxy.$store.commit('setError', e.message)
    } finally {
      loading.value = false
    }
  }

  watch(
    settings,
    () => {
      listOptions.value = { ...listOptions.value, page: 1 }
    },
    { deep: true }
  )

  watch(listOptions, getItems, { deep: true })

  return {
    items,
    loading,
    refreshHandler: getItems,
    count,
    settings,
    listOptions,
    headers,
  }
}
