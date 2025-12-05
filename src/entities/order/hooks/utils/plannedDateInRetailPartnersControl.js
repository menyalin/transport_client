import store from '@/store'

export const plannedDateInRetailPartnersControl = (orderStatus, route) => {
  const controlledStatuses = ['inProgress', 'completed']
  const baseResult = [false, null]
  if (!controlledStatuses.includes(orderStatus)) return baseResult
  const pointsWOPlannedDate = route.filter(point => !point.plannedDate)
  if (pointsWOPlannedDate.length === 0) return baseResult

  if (pointsWOPlannedDate.some(i => store.getters.addressIdsWithDateControlSet.has(i.address)))
    return [true, 'Сохранение рейса невозможно! Заполните плановое время прибытия ТС!']

  return baseResult
}
