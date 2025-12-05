import { computed, ref } from 'vue'
import store from '@/store/index.js'
import { OrderService } from '@/shared/services'

export function useOrderDocs() {
  const docDialog = ref(false)

  const editableOrderId = ref(null)
  const editableDocs = ref([])

  function cancelDocDialog() {
    editableDocs.value = []
    editableOrderId.value = null
    docDialog.value = false
  }

  async function openDocsDialog(orderId) {
    if (!orderId) return null
    editableOrderId.value = orderId
    const order = await OrderService.getById(orderId)
    editableDocs.value = order.docs
    docDialog.value = true
  }

  async function saveDocDialog(val) {
    await OrderService.setDocs(editableOrderId.value, val)
    cancelDocDialog()
  }

  function isValidDocs(docs) {
    if (docs.length === 0) return true
    return !docs.filter(item => !item.type || !item.status).length
  }

  const isReadonlyDocs = computed(() => !store.getters.hasPermission('order:setDocs'))

  const isShowDocs = computed(() => store.getters.hasPermission('order:readDocs'))

  return {
    openDocsDialog,
    cancelDocDialog,
    editableOrderId,
    editableDocs,
    isValidDocs,
    isReadonlyDocs,
    isShowDocs,
    saveDocDialog,
    docDialog,
  }
}
