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
    const docStatusesWithCustomNames = [
      { value: 'accepted', text: 'Приняты' },
      { value: 'needFix', text: 'Доработка' },
      { value: 'missing', text: 'Не приняты' },
    ]

    store.getters.documentStatuses
      .map((i) => i.value)
      .forEach((i) => {
        if (!docStatusesWithCustomNames.map((j) => j.value).includes(i))
          console.error('useOrderListUtils: unexpected document status value')
      })
    return docStatusesWithCustomNames
  })

  function isNotAccepted(doc) {
    return doc.status !== 'accepted'
  }

  function getOrderDocStatus(docs) {
    if (!docs || !docs.length) return { text: 'Не приняты', fontColor: 'red' }
    else if (docs.some(isNotAccepted))
      return { text: 'Доработка', fontColor: 'red' }
    else return { text: 'Приняты', fontColor: 'green' }
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
