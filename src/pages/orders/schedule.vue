<template>
  <ScheduleTable
    :rows="scheduleRows"
    @startDragOrder="startDragOrder"
    @endDragOrder="endDragOrder"
    @updateOrder="updateOrderHandler"
  />
</template>
<script setup>
import { computed, watch, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useStore } from 'vuex'
import { ScheduleTable } from '@/entities/order'
import { OrderService as service } from '@/shared/services'
import periodDifferernce from '@/modules/order/utils/periodDifference'

defineOptions({ name: 'Schedule' })

const store = useStore()
const router = useRouter()

const scheduleRows = computed(() => {
  const trucksInOrdersSet = new Set(
    store.getters.ordersForSchedule.map((i) => i.truckId).filter((i) => !!i)
  )

  store.getters.downtimesForSchedule.forEach((i) => trucksInOrdersSet.add(i.truck))

  const showTrucksFilter = (truck) => {
    if (truck.type !== 'truck') return false

    if (
      trucksInOrdersSet.has(truck._id) ||
      store.getters.fixedInScheduleTrucksIds.includes(truck._id)
    )
      return true

    if (store.getters.onlyTrucksWithRoutes || truck.endServiceDate) return false
    return true
  }

  return store.getters.trucks.filter(showTrucksFilter).sort((a, b) => a.order - b.order)
})

function getData(period) {
  if (!store.getters.directoriesProfile) {
    router.push('/profile')
    return null
  }
  if (period) service.getListForSchedule(period[0], period[1])
  else service.getListForSchedule()
  store.dispatch('getDowntimesForSchedule')
  store.dispatch('getNotesForSchedule')
}

const schedulePeriod = computed(() => store.getters.schedulePeriod)

watch(schedulePeriod, (newPeriod, oldPeriod) => {
  if (!newPeriod) return
  if (!oldPeriod) getData()
  else {
    const { added } = periodDifferernce(newPeriod, oldPeriod)
    getData(added)
  }
})

onMounted(() => {
  if (store.getters.ordersForSchedule.length === 0) {
    getData()
  }
})

async function startDragOrder(orderId) {
  try {
    await service.disable({ orderId, state: true })
  } catch (e) {
    // eslint-disable-next-line no-console
    console.error(e)
  }
}

async function endDragOrder(orderId) {
  try {
    await service.disable({ orderId, state: false })
  } catch (e) {
    // eslint-disable-next-line no-console
    console.error(e)
  }
}

async function updateOrderHandler({ orderId, truckId, startDate }) {
  try {
    await service.moveOrderInSchedule({
      orderId,
      truck: truckId,
      startPositionDate: startDate,
    })
  } catch (e) {
    // eslint-disable-next-line no-console
    console.error(e)
  }
}
</script>
<style scoped></style>
