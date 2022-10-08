import { computed } from 'vue'
import store from '@/store'
import PermissionService from '@/modules/common/services/permission.service'
import orderService from '../services/order.service.js'

export const useOrderListUtils = () => {
  const docsGettedItems = [
    { value: 'yes', text: 'Да' },
    { value: 'no', text: 'Нет' },
  ]

  const minDate = computed(() =>
    PermissionService.minAllowedDate({
      operation: 'order:daysForRead',
    })
  )

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

  async function setDocStateStatus(val, id) {
    await orderService.setDocState(id, val)
  }

  return {
    getOrderDocStatus,
    docStatuses,
    setDocStateStatus,
    docsGettedItems,
    minDate,
  }
}
