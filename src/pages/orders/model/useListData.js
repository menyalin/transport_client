import { ref, computed, watch, onBeforeUnmount } from 'vue'
import dayjs from 'dayjs'
import router from '@/router'
import store from '@/store'
import socket from '@/socket'
import { OrderService, PermissionService } from '@/shared/services'
import usePersistedRef from '@/shared/hooks/usePersistedRef'
import { sortingAdapterForOldApi } from '@/shared/utils/migrationUtils'

const _initPeriod = () => {
  const todayM = dayjs()
  return [todayM.add(-10, 'd').startOf('day').format(), todayM.add(3, 'd').endOf('day').format()]
}

export const useListData = () => {
  const minDate = computed(() =>
    PermissionService.minAllowedDate({
      operation: 'order:daysForRead',
    })
  )

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
  }

  const loading = ref(false)
  const settings = usePersistedRef(initialState, 'ordersList:settings')
  const listOptions = usePersistedRef(initialState, 'ordersList:listOptions')

  const items = ref([])
  const statisticData = ref({
    count: 0,
  })

  function create() {
    router.push('/orders/create')
  }

  watch(
    settings,
    () => {
      listOptions.value = { ...listOptions.value, page: 1 }
    },
    { deep: true }
  )
  watch(listOptions, getData, { deep: true })

  const queryParams = computed(() => ({
    ...settings.value,
    profile: store.getters.directoriesProfile,
    startDate: settings.value.period[0],
    endDate: settings.value.period[1],
    accountingMode: settings.value.accountingMode || null,
    skip: listOptions.value.itemsPerPage * (listOptions.value.page - 1),
    limit: listOptions.value.itemsPerPage,
    // TODO: Переделать на новое API сортировки (на сервере)
    sortBy: sortingAdapterForOldApi(listOptions.value.sortBy).sortBy,
    sortDesc: sortingAdapterForOldApi(listOptions.value.sortBy).sortDesc,
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
    refresh: getData,
    create,
    settings,
    listOptions,
    items,
    statisticData,
    loading,
    minDate,
  }
}
