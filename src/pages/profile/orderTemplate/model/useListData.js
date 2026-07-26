import { computed } from 'vue'
import { useStore } from 'vuex'
import { useOrderStore } from '@/entities/order/orderStore'

function templatesSorting(a, b) {
  return a.name > b.name ? 1 : -1
}

export const useListData = () => {
  const store = useStore()

  const items = computed(() => {
    return [...store.getters.orderTemplates].sort(templatesSorting).map((item) => ({
      ...item,
      clientName: store.getters.partnersMap.get(item.client)?.name || '(__не найден__)',
      routeType: useOrderStore().orderAnalyticTypesMap.get(item?.analytics?.type),
      truckKind: store.getters.truckKindsMap.get(item?.reqTransport?.kind) || ' - ',
    }))
  })
  const headers = [
    { value: 'name', title: 'Название', sortable: true },
    { value: 'clientName', title: 'Заказчик', sortable: true },
    { value: 'routeType', title: 'Тип рейса', sortable: true },
    { value: 'truckKind', title: 'Вид ТС', sortable: true },
    {
      value: 'reqTransport.liftCapacity',
      title: 'Грузоподъемность',
      sortable: true,
    },
  ]
  return {
    items,
    headers,
  }
}
