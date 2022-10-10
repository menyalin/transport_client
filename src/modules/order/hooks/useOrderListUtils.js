import { computed } from 'vue'
import store from '@/store'
import PermissionService from '@/modules/common/services/permission.service'
import orderService from '../services/order.service.js'

export const useOrderListUtils = () => {
  const minDate = computed(() =>
    PermissionService.minAllowedDate({
      operation: 'order:daysForRead',
    })
  )

  const docStatuses = computed(() => {
    const docStatusesWithCustomNames = [
      { value: 'accepted', text: 'Приняты' },
      { value: 'needFix', text: 'На исправлении' },
      { value: 'onCheck', text: 'На проверке' },
      { value: 'missing', text: 'Не получены' },
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

  function getOrderDocStatus(docs, isGetted) {
    if (!isGetted && (!docs || !docs.length))
      return { text: 'Не получены', fontColor: 'red' }
    else if (isGetted && (!docs || !docs.length))
      return { text: 'На проверке', fontColor: 'red' }
    else if (isGetted && docs.some(isNotAccepted))
      return { text: 'На исправлении', fontColor: 'orange' }
    else return { text: 'Приняты', fontColor: 'green' }
  }

  async function setDocStateStatus(val, id) {
    await orderService.setDocState(id, val)
  }

  return {
    getOrderDocStatus,
    docStatuses,
    setDocStateStatus,
    minDate,
  }
}
