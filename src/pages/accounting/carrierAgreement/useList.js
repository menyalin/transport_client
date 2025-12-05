import { ref, watch, computed } from 'vue'
import store from '@/store'
import router from '@/router'
import { useCarrierAgreements } from '@/entities/carrierAgreement'
import { usePersistedRef } from '@/shared/hooks'

export const useListData = () => {
  const listOptions = usePersistedRef(
    { page: 1, itemsPerPage: 200, sortBy: [], sortDesc: [] },
    'carrier_agreement_list_options'
  )
  const headers = ref([])
  const initialState = {
    search: null,
  }

  const settings = usePersistedRef(initialState, 'carrier_agreement_list_settings')
  const queryParams = computed(() => ({
    search: settings.value?.search,
    company: store.getters.directoriesProfile,
    limit: listOptions.value?.itemsPerPage || 50,
    skip: listOptions.value?.itemsPerPage * (listOptions.value?.page - 1) || 0,
    sortBy: listOptions.value?.sortBy || [],
    sortDesc: listOptions.value?.sortDesc || [],
  }))

  //   TODO: почему то не сохраняются listOptions

  const { items, loading, count: totalCount, refresh: refreshHandler } = useCarrierAgreements(queryParams)

  function createHandler() {
    router.push({ name: 'CarrierAgreementCreate' })
  }
  function onDeleteHandler(itemId) {
    items.value = items.value.filter(i => i._id !== itemId)
  }

  function changeHeaders(val) {
    headers.value = val
  }
  watch(settings, () => (listOptions.value = { ...listOptions.value, page: 1 }), { deep: true })

  watch(listOptions, refreshHandler)

  return {
    refreshHandler,
    createHandler,
    settings,
    listOptions,
    items,
    loading,
    onDeleteHandler,
    totalCount,
    changeHeaders,
    headers,
  }
}
