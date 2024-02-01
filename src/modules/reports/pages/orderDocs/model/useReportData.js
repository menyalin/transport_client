import { ref, watch } from 'vue'
import { ReportService } from '@/shared/services'
import { usePersistedRef } from '@/shared/hooks'
import dayjs from 'dayjs'

export default function () {
  const initialState = {
    groupBy: 'month',
    clients: [],
    tks: [],
    state: [],
    getDocsDays: [],
    reviewDocsDays: [],
    date: new dayjs().format('YYYY-MM-DD'),
  }
  const settings = usePersistedRef(initialState, 'OrderDocsReport:settings')
  const items = ref([])
  const statisticData = ref({})
  const loading = ref(false)

  async function refresh() {
    await getData()
  }

  async function getData() {
    try {
      loading.value = true
      const {
        items: itemsData,
        totalCount,
        correctionCount,
        notGettedCount,
        reviewCount,
      } = await ReportService.orderDocs(settings.value)
      items.value = itemsData || []
      statisticData.value = {
        totalCount,
        correctionCount,
        notGettedCount,
        reviewCount,
      }
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

  return {
    settings,
    items,
    statisticData,
    refresh,
    loading,
  }
}
