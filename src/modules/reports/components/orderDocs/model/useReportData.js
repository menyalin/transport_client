import { ref, watch } from 'vue'
import ReportService from '../../../services/index.js'

export default function ({ settings }) {
  const items = ref([])
  const loading = ref(false)

  async function refresh() {
    await getData()
  }

  async function getData() {
    try {
      loading.value = true
      items.value = await ReportService.orderDocs(settings.value)
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
    items,
    refresh,
    loading,
  }
}
