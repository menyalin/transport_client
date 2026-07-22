import { usePersistedRef } from '@/shared/hooks'
import { CrewService } from '@/shared/services'
import { ref, computed, onMounted } from 'vue'
import { useStore } from 'vuex'
import { headers } from './headers'

export const useDriverList = () => {
  const store = useStore()

  function stateFilterHandler(driver) {
    if (listSettings.value.workState === 'all') return true
    if (listSettings.value.workState === 'holiday') return !crewsMapByDriver.value.has(driver._id)
    return crewsMapByDriver.value.has(driver._id)
  }

  function stuffStatusFilterHandler(driver) {
    if (listSettings.value.stuffStatus === 'all') return true
    if (listSettings.value.stuffStatus === 'employee') return !driver.dismissalDate
    if (listSettings.value.stuffStatus === 'fired') return driver.dismissalDate
    return true
  }

  function getDaysInWork(driverId) {
    if (!crewsMapByDriver.value.has(driverId)) return null
    const startDate = new Date(crewsMapByDriver.value.get(driverId).startDate)
    const today = new Date()
    return Math.floor((today - startDate) / (1000 * 60 * 60 * 24))
  }

  function getTruckNumber(driverId) {
    if (!crewsMapByDriver.value.has(driverId)) return null
    const truckId = crewsMapByDriver.value.get(driverId)?.transport?.truck
    return store.getters.trucksMap.get(truckId)?.regNum || null
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
    { value: 'all', title: 'Все' },
    { value: 'employee', title: 'Действующие' },
    { value: 'fired', title: 'Уволены' },
  ]

  const workStateItems = [
    { value: 'all', title: 'Все' },
    { value: 'active', title: 'В работе' },
    { value: 'holiday', title: 'Выходной' },
  ]

  const crewsMapByDriver = computed(() => {
    const tmpMap = new Map()
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

  const directoriesProfile = computed(() => store.getters.directoriesProfile)

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
    allHeaders: headers,
    refresh,
    directoriesProfile,
  }
}
