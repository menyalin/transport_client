import { ref, computed, onMounted } from 'vue'
import { CarrierAgreementService } from '@/shared/services'
import { useStore } from 'vuex'

export const useCarrierAgreements = (settings) => {
  const store = useStore()
  const loading = ref(false)
  const items = ref([])
  const count = ref(0)

  const queryParams = computed(() => {
    return {
      company: store.getters.directoriesProfile,
      limit: 50,
      skip: 0,
      ...settings?.value,
    }
  })

  const itemsMap = computed(() => {
    return new Map(items.value.length ? items.value.map((i) => [i._id, i]) : null)
  })

  async function getData() {
    try {
      loading.value = true
      const res = await CarrierAgreementService.getList(queryParams.value)
      items.value = res.items ?? []
      count.value = res.total ?? 0
    } catch (e) {
      store.commit('setError', e.message)
    } finally {
      loading.value = false
    }
  }
  onMounted(async () => {
    if (!settings?.value) await getData()
  })
  return {
    items,
    itemsMap,
    loading,
    count,
    refresh: getData,
  }
}
