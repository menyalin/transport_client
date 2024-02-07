import { ref, watch, onMounted, computed } from 'vue'
import { ReportService } from '@/shared/services'
import { usePersistedRef } from '@/shared/hooks'
import { AgreementService } from '@/shared/services/index'
import dayjs from 'dayjs'

export default function () {
  const setInitialPeriod = () => [
    new dayjs().add(-1, 'month').startOf('month').toISOString(),
    new dayjs().toISOString(),
  ]

  const initialState = {
    period: setInitialPeriod(),
    groupBy: 'month',
    tks: [],
    agreements: [],
  }
  const settings = usePersistedRef(
    initialState,
    'OrderWOInvoiceReport:settings'
  )
  const agreements = ref([])
  const agreementItems = computed(() =>
    agreements.value
      .filter((i) => i.isOutsourceAgreement !== true)
      .sort((a, b) => (a.name < b.name ? -1 : 1))
  )
  const items = ref([])
  const statisticData = ref({})
  const loading = ref(false)

  async function refresh() {
    await getData()
  }

  async function getData() {
    try {
      loading.value = true
      const [itemsData] = await ReportService.ordersWOInvoice(settings.value)
      items.value = itemsData || []
      // statisticData.value = {
      //   totalCount,
      //   correctionCount,
      //   notGettedCount,
      //   reviewCount,
      // }
      loading.value = false
    } catch (e) {
      loading.value = false
      console.log('Ошибка !', e)
    }
  }

  watch(
    settings,
    async () => {
      await getData()
    },
    { immediate: true }
  )

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
  }
}
