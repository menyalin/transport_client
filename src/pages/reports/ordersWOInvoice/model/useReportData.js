import dayjs from 'dayjs'
import { ref, watch, onMounted, computed } from 'vue'
import { ReportService, AgreementService } from '@/shared/services'
import { usePersistedRef } from '@/shared/hooks'

import store from '@/store'

export default function () {
  const setInitialPeriod = () => [
    new dayjs().startOf('month').toISOString(),
    new dayjs().toISOString(),
  ]

  const initialState = {
    period: setInitialPeriod(),
    tks: [],
    agreements: [],
  }
  const settings = usePersistedRef(
    initialState,
    'OrderWOInvoiceReport:settings'
  )

  function resetListOptions() {
    listOptions.value = { ...listOptions.value, page: 1 }
  }
  const listOptions = usePersistedRef(
    {
      page: 1,
      itemsPerPage: 50,
      sortBy: [],
      sortDesc: [],
    },
    'OrderWOInvoiceReport:listOptions'
  )

  const agreements = ref([])
  const agreementItems = computed(() =>
    agreements.value
      .filter((i) => i.isOutsourceAgreement !== true)
      .sort((a, b) => (a.name < b.name ? -1 : 1))
  )
  const items = ref([])
  const statisticData = ref({
    count: 0,
    total: {
      withVat: 0,
      woVat: 0,
    },
  })
  const loading = ref(false)

  async function refresh() {
    await getData()
  }

  async function getData() {
    try {
      loading.value = true
      const [itemsData, data] = await ReportService.ordersWOInvoice({
        ...settings.value,
        skip: (listOptions.value.page - 1) * listOptions.value.itemsPerPage,
        limit: listOptions.value.itemsPerPage,
        sortBy: listOptions.value.sortBy,
        sortDesc: listOptions.value.sortDesc,
      })
      statisticData.value = data || { count: 0 }
      items.value = itemsData || []
      loading.value = false
    } catch (e) {
      store.commit('setError', e.message)
    } finally {
      loading.value = false
    }
  }

  watch(listOptions, async () => {
    await getData()
  })

  watch(settings, resetListOptions)

  onMounted(async () => {
    agreements.value = await AgreementService.getActiveAgreements()
  })

  return {
    settings,
    items,
    statisticData,
    refresh,
    loading,
    agreementItems,
    listOptions,
  }
}
