import { getCurrentInstance, computed, ref, onMounted } from 'vue'
import { CarrierService } from '@/shared/services'

export const useCarriers = (settings = {}) => {
  const { proxy } = getCurrentInstance()
  const items = ref([])
  const loading = ref(false)
  const count = ref(0)
  const queryParams = computed(() => {
    return {
      company: proxy.$store.getters.directoriesProfile,
      limit: 50,
      skip: 0,
      ...settings,
    }
  })

  const ownCarriers = computed(() =>
    proxy.$store.getters.tkNames.filter((i) => !i.outsource)
  )

  const outsourceCarriers = computed(() =>
    proxy.$store.getters.tkNames.filter((i) => i.outsource)
  )

  async function getItems(params) {
    try {
      loading.value = true
      const res = await CarrierService.getList(params || queryParams.value)
      items.value = res.items ?? []
      count.value = res.count ?? 0
    } catch (e) {
      proxy.$store.commit('setError', e.message)
    } finally {
      loading.value = false
    }
  }

  onMounted(async () => {
    if (!settings) await getItems()
  })

  return {
    items,
    loading,
    count,
    refresh: getItems,
    ownCarriers,
    outsourceCarriers,
  }
}
