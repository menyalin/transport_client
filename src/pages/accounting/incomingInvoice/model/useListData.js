import { ref, watch, computed } from 'vue'
import store from '@/store'
import router from '@/router'
import { IncomingInvoiceService } from '@/shared/services'
import dayjs from 'dayjs'
import { usePersistedRef } from '@/shared/hooks'

export const useListData = () => {
  const headers = ref([])
  function initialPeriod() {
    const startDate = dayjs().startOf('month').toISOString()
    const endDate = dayjs().endOf('month').toISOString()
    return [startDate, endDate]
  }

  const initialState = {
    agreements: [],
    statuses: [],
    carriers: [],
    period: initialPeriod(),
    number: null,
  }

  const settings = usePersistedRef(
    initialState,
    'incomingInvoice_list_settings'
  )
  const listOptions = usePersistedRef({}, 'incomingInvoice_list_options')

  const items = ref([])
  const totalCount = ref(0)

  const loading = ref(false)

  const queryParams = computed(() => ({
    period: settings.value?.period,
    statuses: settings.value?.statuses,
    carriers: settings.value?.carriers ?? [],
    search: settings.value?.search,
    agreements: settings.value?.agreements,
    company: store.getters.directoriesProfile,
    limit: listOptions.value?.itemsPerPage || 50,
    skip: listOptions.value?.itemsPerPage * (listOptions.value?.page - 1) || 0,
    sortBy: listOptions.value?.sortBy || [],
    sortDesc: listOptions.value?.sortDesc || [],
  }))

  async function getData() {
    try {
      loading.value = true
      const data = await IncomingInvoiceService.getList(queryParams.value)
      items.value = data.items
      totalCount.value = data.count
      loading.value = false
    } catch (e) {
      loading.value = false
      store.commit('setError', e.message)
    }
  }
  async function refresh() {
    await getData()
  }

  function create() {
    router.push('/accounting/incomingInvoice/create')
  }
  function onDeleteHandler(itemId) {
    items.value = items.value.filter((i) => i._id !== itemId)
  }

  function changeHeaders(val) {
    headers.value = val
  }
  watch(
    settings,
    () => (listOptions.value = { ...listOptions.value, page: 1 }),
    { deep: true }
  )

  watch(listOptions, async () => await getData(), { deep: true })

  return {
    refresh,
    create,
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
