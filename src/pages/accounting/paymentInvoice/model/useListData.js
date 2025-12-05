import { ref, watch, computed } from 'vue'
import store from '@/store'
import router from '@/router'
import { PaymentInvoiceService } from '@/shared/services'
import { usePersistedRef } from '@/shared/hooks'
import dayjs from 'dayjs'

export const useListData = () => {
  function initialPeriod() {
    const startDate = dayjs().startOf('month').toISOString()
    const endDate = dayjs().endOf('month').toISOString()
    return [startDate, endDate]
  }
  const initialState = {
    agreements: [],
    statuses: [],
    period: initialPeriod(),
    periodBy: 'date',
  }
  const settings = usePersistedRef(initialState, 'paymentInvoice_list_settings')
  const listOptions = usePersistedRef({}, 'paymentInvoice_list_options')

  const items = ref([])
  const totalCount = ref(0)
  const routesCount = ref(0)
  const total = ref({
    sum: 0,
    sumWOVat: 0,
  })

  const loading = ref(false)

  async function refresh() {
    await getData()
  }

  function create() {
    router.push('/accounting/paymentInvoice/create')
  }

  const queryParams = computed(() => ({
    periodBy: settings.value?.periodBy || 'date',
    period: settings.value?.period,
    statuses: settings.value?.statuses,
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
      const data = await PaymentInvoiceService.getList(queryParams.value)
      items.value = data.items
      totalCount.value = data.count
      routesCount.value = data.routesCount
      total.value = data.total
      loading.value = false
    } catch (e) {
      loading.value = false
      store.commit('setError', e.message)
    }
  }

  function onDeleteHandler(itemId) {
    items.value = items.value.filter(i => i._id !== itemId)
  }

  async function downloadHandler() {
    try {
      loading.value = true
      await PaymentInvoiceService.getPaymentInvocesListFile(queryParams.value)
      loading.value = false
    } catch (e) {
      loading.value = false
      store.commit('setError', e.message)
    }
  }

  watch(
    settings,
    () => {
      listOptions.value = { ...listOptions.value, page: 1 }
    },
    { deep: true }
  )

  watch(
    listOptions,
    async () => {
      await getData()
    },
    { deep: true }
  )

  return {
    refresh,
    create,
    settings,
    listOptions,
    items,
    loading,
    total,
    onDeleteHandler,
    totalCount,
    routesCount,
    downloadHandler,
  }
}
