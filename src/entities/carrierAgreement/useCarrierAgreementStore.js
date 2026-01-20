import { ref, computed } from 'vue'
import { defineStore } from 'pinia'

import { CarrierAgreementService } from '@/shared/services'

export const useCarrierAgreementStore = defineStore(
  'CarrierAgreementStore',
  () => {
    const items = ref([])

    const itemsMap = computed(() => {
      const res = new Map()
      items.value.forEach((i) => {
        res.set(i._id, { ...i })
      })
      return res
    })

    async function getById(id) {
      if (itemsMap.value.has(id)) return itemsMap.value.get(id)
      const res = await CarrierAgreementService.getById(id)
      if (res) {
        items.value.push(res)
        return res
      } else null
    }

    return { items, itemsMap, getById }
  }
)
