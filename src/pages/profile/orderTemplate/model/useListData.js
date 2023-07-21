import store from '@/store'
import { computed } from 'vue'
function templatesSorting(a, b) {
  return a.name > b.name ? 1 : -1
}

export const useListData = () => {
  const items = computed(() => {
    return store.getters.orderTemplates.sort(templatesSorting).map((item) => ({
      ...item,
      clientName:
        store.getters.partnersMap.get(item.client)?.name || '(__не найден__)',
      routeType: store.getters.orderAnalyticTypesMap.get(item?.analytics?.type),
      truckKind:
        store.getters.truckKindsMap.get(item?.reqTransport.kind) || ' - ',
    }))
  })
  const headers = [
    { value: 'name', text: 'Название', sortable: true },
    { value: 'clientName', text: 'Заказчик', sortable: true },
    { value: 'routeType', text: 'Тип рейса', sortable: true },
    { value: 'truckKind', text: 'Вид ТС', sortable: true },
    {
      value: 'reqTransport.liftCapacity',
      text: 'Грузоподъемность',
      sortable: true,
    },
  ]
  return {
    items,
    headers,
  }
}
