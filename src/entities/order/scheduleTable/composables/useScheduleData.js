import { computed } from 'vue'
import { useStore } from 'vuex'

export function useScheduleData(settings) {
  const store = useStore()

  const filteredOrders = computed(() => {
    const orders = store.getters.ordersForSchedule
    if (!settings.value?.controlOnly) return orders
    return orders.filter((i) => i.state.warning)
  })

  const distributedOrders = computed(() => {
    return filteredOrders.value.filter((i) => !!i?.truckId)
  })

  const unDistributedOrders = computed(() => {
    return filteredOrders.value.filter((i) => !i?.truckId)
  })

  const filteredNotes = computed(() => {
    if (settings.value?.showNotes) return store.getters.notesForSchedule
    return []
  })

  const filteredDowntimes = computed(() => {
    if (!settings.value?.showDowntimes) return []
    return store.getters.downtimesForSchedule
  })

  const downtimeTruckIdMap = computed(() => {
    if (!settings.value?.showDowntimes) return {}
    const map = {}
    for (const d of store.getters.downtimesForSchedule) {
      map[d._id] = d.truck
    }
    return map
  })

  const itemTypeMap = computed(() => {
    const map = {}
    for (const o of distributedOrders.value) map[o._id] = 'order'
    for (const d of filteredDowntimes.value) map[d._id] = 'downtime'
    return map
  })

  const allItems = computed(() => {
    const items = [...distributedOrders.value, ...filteredDowntimes.value]
    return items.sort((a, b) => new Date(a.startPositionDate) - new Date(b.startPositionDate))
  })

  return {
    filteredOrders,
    distributedOrders,
    unDistributedOrders,
    filteredNotes,
    filteredDowntimes,
    downtimeTruckIdMap,
    itemTypeMap,
    allItems,
  }
}
