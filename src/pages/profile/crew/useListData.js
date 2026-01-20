import usePersistedRef from '@/shared/hooks/usePersistedRef'
import { ref, computed, watch, getCurrentInstance } from 'vue'
import { CrewService } from '@/shared/services'
import dayjs from 'dayjs'
import { useCarrierStore } from '@/entities/carrier'

export const useListData = () => {
  const carrierStore = useCarrierStore()
  const { proxy } = getCurrentInstance()

  const setInitialPeriod = () => {
    return [
      dayjs().startOf('month').toISOString(),
      dayjs().endOf('month').toISOString(),
    ]
  }
  const headers = [
    { value: 'tkName', text: 'ТК' },
    { value: 'isActual', text: 'В работе', sortable: false },
    { value: 'truck', text: 'Грузовик', sortable: false },
    { value: 'trailer', text: 'Прицеп', sortable: false },
    { value: 'driver', text: 'Водитель' },
    { value: 'startDate', text: 'Начало смены' },
    { value: 'endDate', text: 'Завершение смены', sortable: false },
  ]
  const items = ref([])
  const totalCount = ref(0)
  const loading = ref(false)

  const crewStatuses = [
    { value: 'all', text: 'Все' },
    { value: 'active', text: 'В работе' },
    { value: 'inactive', text: 'Завершенные' },
  ]

  const settings = usePersistedRef(
    {
      period: setInitialPeriod(),
      driver: null,
      truck: null,
      tkName: null,
      crewStatus: 'active',
    },
    'crewList:settings'
  )

  const listOptions = usePersistedRef(
    {
      page: 1,
      itemsPerPage: 50,
    },
    'crewList:listOptions'
  )
  const driverItems = computed(() => {
    return proxy.$store.getters
      .driversForSelect(settings.value.tkName)
      .map((d) => ({
        ...d,
        value: d._id,
        text: d?.fullName || 'invalid_full_name',
      }))
  })

  const truckItems = computed(() => {
    return proxy.$store.getters
      .trucksForSelect({
        type: 'truck',
        tkName: settings.value?.tkName,
      })
      .map((t) => ({
        ...t,
        value: t._id,
        text: t.regNum,
      }))
  })
  const queryParams = computed(() => ({
    profile: proxy.$store.getters.directoriesProfile,
    period: settings.value?.period,
    driver: settings.value?.driver,
    tkName: settings.value?.tkName,
    truck: settings.value?.truck,
    skip: listOptions.value?.itemsPerPage * (listOptions.value?.page - 1) || 0,
    limit: listOptions.value?.itemsPerPage || 50,
    state: settings.value?.crewStatus,
    sortBy: listOptions.value?.sortBy[0] ?? null,
    sortDesc: listOptions.value?.sortDesc[0] ?? null,
  }))

  async function getData() {
    try {
      loading.value = true
      const res = await CrewService.getList(queryParams.value)
      items.value = res.items ?? []
      totalCount.value = res.count ?? 0
    } catch (e) {
      proxy.$store.commit('setError', e?.message || e)
    } finally {
      loading.value = false
    }
  }

  function createHandler() {
    proxy.$router.push({ name: 'CrewCreate' })
  }
  function dblClickRowHandler(_, { item }) {
    if (item) proxy.$router.push(`crews/${item._id}`)
  }

  async function refreshHandler() {
    await getData()
  }

  function getTruckName(crew, field) {
    const lastIdx = crew.transport.length - 1
    const truckId = crew.transport[lastIdx][field]
    return truckId
      ? proxy.$store.getters.trucksMap.get(truckId)?.regNum || '__error__'
      : ' - '
  }
  function getDriverName(crew) {
    if (!!crew.driver && proxy.$store.getters.driversMap.has(crew.driver))
      return proxy.$store.getters.driversMap.get(crew.driver)?.fullName || null
    else return ' - '
  }

  function isActualCrew(crew) {
    const lastIdx = crew.transport.length - 1
    return !crew.transport[lastIdx].endDate
  }

  async function downloadHandler() {
    await CrewService.getCrewListFile(queryParams.value)
  }

  watch(
    settings,
    () => {
      listOptions.value = Object.assign({}, listOptions.value, { page: 1 })
    },
    { deep: true }
  )

  watch(
    listOptions,
    async () => {
      await getData()
    },
    { deep: true }
  )

  return {
    settings,
    listOptions,
    crewStatuses,
    loading,
    items,
    headers,
    totalCount,
    createHandler,
    refreshHandler,

    dblClickRowHandler,
    downloadHandler,
    carrierItems: carrierStore.carriers,
    driverItems,
    truckItems,
    getTruckName,
    getDriverName,
    isActualCrew,
  }
}
