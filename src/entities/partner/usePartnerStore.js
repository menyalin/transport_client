import { defineStore } from 'pinia'
import { computed, getCurrentInstance } from 'vue'

export const usePartnerStore = defineStore('PartnerStore', () => {
  const { proxy } = getCurrentInstance()

  const allPartners = computed(() => {
    return proxy.$store.getters.partners
  })

  const partnersMap = computed(() => {
    return new Map(allPartners.value.map((item) => [item._id, item]))
  })

  function getById(id) {
    return partnersMap.value.get(id)
  }

  return {
    getById,
  }
})
