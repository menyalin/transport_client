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
      } = await ReportService.orderDocs({
        ...settings.value,
        date: dayjs(settings.value?.date || undefined)
          .endOf('day')
          .toISOString(),
      })
      items.value = itemsData || []
      statisticData.value = {
        totalCount,
        correctionCount,
        notGettedCount,
        reviewCount,
      }
    } catch (e) {
      console.log('Ошибка !', e)
    } finally {
      loading.value = false
    }
  }

  watch(settings, getData, { immediate: true, deep: true })

  return {
    settings,
    items,
    statisticData,
    refresh,
    loading,
  }
}
