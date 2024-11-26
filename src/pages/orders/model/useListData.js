import { ref, computed, watch, onBeforeUnmount } from 'vue'
import dayjs from 'dayjs'
import router from '@/router'
import store from '@/store'
import socket from '@/socket'
import { OrderService, PermissionService } from '@/shared/services'
import usePersistedRef from '@/shared/hooks/usePersistedRef'

const _initPeriod = () => {
  const todayM = dayjs()
  return [
    todayM.add(-10, 'd').startOf('day').format(),
    todayM.add(3, 'd').endOf('day').format(),
  ]
}

export const useListData = () => {
  const minDate = computed(() =>
    PermissionService.minAllowedDate({
      operation: 'order:daysForRead',
    })
  )
  const historyState = window.history.state
  const initialState = {
    clients: [],
    agreements: [],
    tkNames: [],
    trucks: [],
    trailer: null,
    address: null,
    loadingZones: [],
    driver: null,
    searchNum: null,
    statuses: [],
    docStatuses: [],
    invoiceStatus: null,
    accountingMode: !!parseInt(localStorage.getItem('orders:accontingMode')),
    period: _initPeriod(),
    listOptions: {
      page: 1,
      itemsPerPage: 50,
    },
  }

  const loading = ref(false)
  const settings = usePersistedRef(
    historyState?.settings || initialState,
    'ordersListSettings'
  )
  const items = ref([])
  const statisticData = ref({
    count: 0,
  })

  async function refresh() {
    await getData()
  }

  function create() {
    router.push('/orders/create')
  }

  watch(settings, async () => await getData(), { deep: true })

  const queryParams = computed(() => ({
    clients: settings.value.clients,
    trucks: settings.value.trucks,
    trailer: settings.value.trailer,
    address: settings.value.address,
    driver: settings.value.driver,
    agreements: settings.value.agreements,
    docStatuses: settings.value.docStatuses,
    invoiceStatus: settings.value.invoiceStatus,
    tkNames: settings.value.tkNames,
    statuses: settings.value.statuses,
    searchNum: settings.value.searchNum,
    loadingZones: settings.value.loadingZones,
    profile: store.getters.directoriesProfile,
    startDate: settings.value.period[0],
    endDate: settings.value.period[1],
    accountingMode: settings.value.accountingMode || null,
    skip:
      settings.value.listOptions.itemsPerPage *
      (settings.value.listOptions.page - 1),
    limit: settings.value.listOptions.itemsPerPage,
    sortBy: settings.value.listOptions.sortBy,
    sortDesc: settings.value.listOptions.sortDesc,
  }))

  async function getData() {
    if (!queryParams.value) return null
    try {
      loading.value = true
      const data = await OrderService.getList(queryParams.value)
      loading.value = false
      items.value = data.items
      statisticData.value = { ...data, items: null }
    } catch (e) {
      store.commit('setError', e.message)
    }
  }
  function updateItems(data) {
    if (!items.value) return null
    let order = items.value.find((item) => item._id === data._id)
    if (!order) return null
    order = Object.assign(order, data)
  }

  socket.on('order:updated', updateItems)
  onBeforeUnmount(() => {
    socket.off('order:updated', updateItems)
  })

  return {
    refresh,
    create,
    settings,
    items,
    statisticData,
    loading,
    minDate,
  }
}
