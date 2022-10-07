import store from '@/store'
import { computed } from 'vue'

export const useOrderListUtils = () => {
  const docStatuses = computed(() => {
    return store.getters.documentStatuses
  })

  function isNotAccepted(doc) {
    return doc.status !== 'accepted'
  }

  function getOrderDocStatus(docs) {
    if (!docs || !docs.length) return 'Не приняты'
    else if (docs.some(isNotAccepted)) return 'Доработка'
    else return 'Приняты'
  }

  return {
    getOrderDocStatus,
    docStatuses,
  }
}
