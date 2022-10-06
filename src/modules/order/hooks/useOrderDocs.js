import store from '@/store/index.js'
import { computed } from 'vue'

export function useOrderDocs() {
  function isValidDocs(docs) {
    if (docs.length === 0) return true
    return !docs.filter((item) => !item.type || !item.status).length
  }

  const isReadonlyDocs = computed(
    () => !store.getters.hasPermission('order:setDocs')
  )

  const isShowDocs = computed(() =>
    store.getters.hasPermission('order:readDocs')
  )

  return {
    isValidDocs,
    isReadonlyDocs,
    isShowDocs,
  }
}
