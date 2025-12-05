import { computed } from 'vue'
import store from '@/store'
import PermissionService from '@/shared/services/permission.service'
import { OrderService } from '@/shared/services'

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
      .map(i => i.value)
      .forEach(i => {
        if (!docStatusesWithCustomNames.map(j => j.value).includes(i))
          console.error('useOrderListUtils: unexpected document status value')
      })
    return docStatusesWithCustomNames
  })

  async function setDocStateStatus(val, id) {
    await OrderService.setDocState(id, val)
  }

  return {
    docStatuses,
    setDocStateStatus,
    minDate,
  }
}
