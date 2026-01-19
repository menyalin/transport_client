import { usePersistedRef } from '@/shared/hooks'
import { CrewService } from '@/shared/services'
import { ref, computed, onMounted } from 'vue'
import store from '@/store'
import { headers } from './headers'
import { useCarrierStore } from '@/entities/carrier'

export const useDriverList = () => {
  const carrierStore = useCarrierStore()

  function stateFilterHandler(driver) {
    if (listSettings.value.workState === 'all') return true
    if (listSettings.value.workState === 'holiday')
      return !crewsMapByDriver.value.has(driver._id)
    else return crewsMapByDriver.value.has(driver._id)
  }

  function stuffStatusFilterHandler(driver) {
    if (listSettings.value.stuffStatus === 'all') return true
    if (listSettings.value.stuffStatus === 'employee')
      return !driver.dismissalDate
    if (listSettings.value.stuffStatus === 'fired') return driver.dismissalDate
  }

  function getDaysInWork(driverId) {
    if (!crewsMapByDriver.value.has(driverId)) return null
    else {
      const startDate = new Date(crewsMapByDriver.value.get(driverId).startDate)
      const today = new Date()
      return Math.floor((today - startDate) / (1000 * 60 * 60 * 24))
    }
  }

  function getTruckNumber(driverId) {
    if (!crewsMapByDriver.value.has(driverId)) return null
    else {
      const truckId = crewsMapByDriver.value.get(driverId)?.transport?.truck
      return store.getters.trucksMap.get(truckId)?.regNum || null
    }
  }

  async function getData() {
    loading.value = true
    crews.value = await CrewService.getActualCrewsOnCurrentDate({
      profile: store.getters.directoriesProfile,
    })
    loading.value = false
  }
  async function refresh() {
    store.dispatch('getDrivers', true)
    await getData()
  }

  const tkNameItems = computed(() => carrierStore.carriers)

  const crews = ref([])
  const loading = ref(false)
  const listSettings = usePersistedRef(
    {
      workState: 'all',
      stuffStatus: 'employee',
      listOptions: {},
      search: null,
      tkNameFilter: null,
    },
    'driverListSettings'
  )

  const stuffStatusItems = [
    { value: 'all', text: 'Все' },
    { value: 'employee', text: 'Действующие' },
    { value: 'fired', text: 'Уволены' },
  ]

  const workStateItems = [
    { value: 'all', text: 'Все' },
    { value: 'active', text: 'В работе' },
    { value: 'holiday', text: 'Выходной' },
  ]

  const crewsMapByDriver = computed(() => {
    let tmpMap = new Map()
    crews.value.forEach((cr) => {
      tmpMap.set(cr.driver, { ...cr })
    })
    return tmpMap
  })

  const filteredDrivers = computed(() =>
    store.getters.drivers
      .filter((item) =>
        listSettings.value.tkNameFilter
          ? item.tkName?._id === listSettings.value.tkNameFilter
          : true
      )
      .filter(stateFilterHandler)
      .filter(stuffStatusFilterHandler)
      .map((d) => ({
        ...d,
        state: crewsMapByDriver.value.has(d._id) ? 'В работе' : 'Выходной',
        daysInWork: getDaysInWork(d._id),
        truckNumber: getTruckNumber(d._id),
      }))
  )
  onMounted(async () => {
    await getData()
    store.dispatch('getDrivers')
  })

  return {
    stuffStatusItems,
    workStateItems,
    listSettings,
    loading,
    filteredDrivers,
    tkNameItems,
    allHeaders: headers,
    refresh,
  }
}
