import { ref, computed, onMounted } from 'vue'
import { defineStore } from 'pinia'

import { CarrierAgreementService } from '@/shared/services'

export const useCarrierAgreementStore = defineStore(
  'CarrierAgreementStore',
  () => {
    const loading = ref(false)
    const items = ref([])

    const itemsMap = computed(() => {
      const res = new Map()
      items.value.forEach((i) => {
        res.set(i._id, { ...i })
      })
      return res
    })

    async function getById(id) {
      try {
        if (itemsMap.value.has(id)) return itemsMap.value.get(id)
        loading.value = true
        const res = await CarrierAgreementService.getById(id)
        if (res) {
          items.value.push(res)
          return res
        } else null
      } finally {
        loading.value = false
      }
    }

    async function getAll() {
      try {
        loading.value = true
        const res = await CarrierAgreementService.getActiveAgreements()
        items.value = res
        return res
      } finally {
        loading.value = false
      }
    }

    onMounted(async () => {
      await getAll()
    })
    return { items, itemsMap, getById, loading }
  }
)
