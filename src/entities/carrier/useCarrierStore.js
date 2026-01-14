import { defineStore } from 'pinia'
import { onMounted, ref, computed } from 'vue'
import { CarrierService } from '@/shared/services'

export const useCarrierStore = defineStore('CarrierStore', () => {
  console.log('CarrierStore props: ')
  //   const { proxy } = getCurrentInstance()
  const carriers = ref([])
  const loading = ref(false)

  //   const queryParams = computed(() => {
  //     return {
  //       company: proxy.$store.getters.directoriesProfile,
  //     }
  //   })
  const ownCarriers = computed(() => carriers.value.filter((i) => !i.outsource))
  const outsourceCarriers = computed(() =>
    carriers.value.ilter((i) => i.outsource)
  )

  async function getItems() {
    try {
      loading.value = true
      //   const res = await CarrierService.getList(params || queryParams.value)
      const res = await CarrierService.getList()
      carriers.value = res.items ?? []
    } finally {
      loading.value = false
    }
  }

  onMounted(async () => {
    await getItems()
  })

  return { carriers, loading, ownCarriers, outsourceCarriers }
})
