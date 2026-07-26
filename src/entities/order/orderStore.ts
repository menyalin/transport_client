import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { OrderService } from '@/shared/services'
import dayjs from 'dayjs'
import 'dayjs/plugin/isSameOrBefore'

interface RoutePoint {
  arrivalDate?: string
  departureDate?: string
  plannedDate?: string
  [key: string]: any
}

interface Order {
  _id: string
  company?: any
  route: RoutePoint[]
  startPositionDate?: string
  confirmedCrew?: { truck?: string }
  isDisabled?: boolean
  state?: string
  [key: string]: any
}

interface OrderForSchedule {
  _id: string
  company?: any
  needRoundTime: boolean
  isCompleted: boolean
  startPositionDate: string
  endPositionDate: string
  lastPlannedDate: string | null
  truckId?: string
  isDisabled?: boolean
  state?: string
  route: RoutePoint[]
}

const _getStartPositionDate = (order: Order): string => {
  return order.route[0]?.arrivalDate ? order.route[0].arrivalDate : order.startPositionDate || ''
}

const _getLastPlannedDate = (order: Order): string | null => {
  const tmpRoute = order.route.slice()
  tmpRoute.shift()
  let plannedDates: string[] = []
  for (const point of tmpRoute) {
    if (point.plannedDate) plannedDates.push(point.plannedDate)
  }
  plannedDates = plannedDates
    .filter((x) => !!x)
    .sort((a, b) => new Date(b).getTime() - new Date(a).getTime())
  return plannedDates.length ? plannedDates[0] : null
}

const _getLastPositionDate = (order: Order): string => {
  const tmpRoute = order.route.slice()
  if (tmpRoute[tmpRoute.length - 1].departureDate)
    return tmpRoute[tmpRoute.length - 1].departureDate as string
  let routeDates: string[] = []
  routeDates.push(order.startPositionDate || '')
  for (let i = 0; i < tmpRoute.length; i++) {
    if (i !== 0 && tmpRoute[i].plannedDate) routeDates.push(tmpRoute[i].plannedDate as string)
    if (tmpRoute[i].arrivalDate) routeDates.push(tmpRoute[i].arrivalDate as string)
    if (tmpRoute[i].departureDate) routeDates.push(tmpRoute[i].departureDate as string)
  }
  routeDates = routeDates.filter((date) => !!date)
  return routeDates.sort((a, b) => new Date(b).getTime() - new Date(a).getTime())[0] || ''
}

const _getZoneName = (date: string): string => {
  const hours = new Date(date).getHours()
  if (hours < 6) return '00-06'
  if (hours < 12) return '06-12'
  if (hours < 18) return '12-18'
  return '18-24'
}

export const useOrderStore = defineStore('order', () => {
  const orders = ref<Order[]>([])
  const period = ref<string[]>([])
  const orderStatuses = ref<{ value: string; text: string }[]>([])
  const scheduleDate = ref(dayjs().format('YYYY-MM-DD'))
  const onlyPlannedDates = ref(localStorage.getItem('orders:onlyPlannedDates') === 'true')
  const orderAnalyticTypes = ref<{ value: string; text: string }[]>([])
  const orderPriceTypes = ref<{ value: string; text: string }[]>([])
  const onlyTrucksWithRoutes = ref(localStorage.getItem('orders:onlyTrucksWithRoutes') !== 'false')

  function _computeOrdersForSchedule(
    ordersList: Order[],
    periodVal: string[],
    onlyPlanned: boolean
  ): OrderForSchedule[] {
    const schedulePeriod =
      periodVal.length === 2
        ? [periodVal[0], dayjs(periodVal[1]).add(1, 'd').format('YYYY-MM-DD')]
        : null

    return ordersList
      .map((item) => ({
        _id: item._id,
        company: item.company,
        needRoundTime: !item.route[0]?.arrivalDate || onlyPlanned || !item.confirmedCrew?.truck,
        isCompleted: !!item.route[item.route.length - 1]?.departureDate,
        startPositionDate: onlyPlanned ? item.startPositionDate || '' : _getStartPositionDate(item),
        endPositionDate: onlyPlanned ? item.startPositionDate || '' : _getLastPositionDate(item),
        lastPlannedDate: _getLastPlannedDate(item),
        truckId: item.confirmedCrew?.truck,
        isDisabled: item.isDisabled,
        state: item.state,
        route: item.route,
      }))
      .filter((order) => {
        if (periodVal.length !== 2 || !schedulePeriod) return true
        const sP = dayjs(schedulePeriod[0])
        const eP = dayjs(schedulePeriod[1])
        return eP.isAfter(order.startPositionDate) && sP.isSameOrBefore(order.endPositionDate)
      })
      .sort(
        (a, b) => new Date(a.startPositionDate).getTime() - new Date(b.startPositionDate).getTime()
      )
  }

  const pointTypes = [
    { value: 'loading', text: 'Погрузка' },
    { value: 'unloading', text: 'Выгрузка' },
  ]

  const ordersForSchedule = computed<OrderForSchedule[]>(() =>
    _computeOrdersForSchedule(orders.value, period.value, onlyPlannedDates.value)
  )

  const ordersMap = computed<Map<string, Order>>(
    () => new Map(orders.value.map((item) => [item._id, item]))
  )

  const orderCountByDates = computed<Map<string, { totalInDay: number; [key: string]: number }>>(
    () => {
      const tmpRes = new Map<string, { totalInDay: number; [key: string]: number }>()
      if (orders.value.length) {
        const filteredOrders = orders.value.filter((o) => o.confirmedCrew?.truck)
        filteredOrders.forEach((order) => {
          const dayStr = dayjs(order.startPositionDate).format('YYYY-MM-DD')
          const zone = _getZoneName(order.startPositionDate || '')
          const existing = tmpRes.get(dayStr)
          const newDay = {
            ...existing,
            totalInDay: existing ? existing.totalInDay + 1 : 1,
            [zone]: existing?.[zone] ? existing[zone] + 1 : 1,
          }
          tmpRes.set(dayStr, newDay)
        })
      }
      return tmpRes
    }
  )

  const schedulePeriod = computed<string[] | null>(() => {
    if (period.value.length !== 2) return null
    return [period.value[0], dayjs(period.value[1]).add(1, 'd').format('YYYY-MM-DD')]
  })

  const orderStatusesMap = computed<Map<string, string>>(
    () => new Map(orderStatuses.value.map((item) => [item.value, item.text]))
  )

  const orderAnalyticTypesMap = computed<Map<string, string>>(
    () => new Map(orderAnalyticTypes.value.map((item) => [item.value, item.text]))
  )

  const orderPriceTypesMap = computed<Map<string, string>>(
    () => new Map(orderPriceTypes.value.map((t) => [t.value, t.text]))
  )

  function changeOnlyTrucksWithRoutes() {
    onlyTrucksWithRoutes.value = !onlyTrucksWithRoutes.value
    localStorage.setItem('orders:onlyTrucksWithRoutes', String(onlyTrucksWithRoutes.value))
  }

  function changeOnlyPlannedDates() {
    onlyPlannedDates.value = !onlyPlannedDates.value
    if (!onlyPlannedDates.value) localStorage.removeItem('orders:onlyPlannedDates')
    else localStorage.setItem('orders:onlyPlannedDates', 'true')
  }

  function setPeriod(payload: string[]) {
    period.value = payload
  }

  function clearDirectories() {
    orders.value = []
  }

  function setOrders(payload: Order[]) {
    orders.value = payload
  }

  function addOrder(payload: Order) {
    if (orders.value.findIndex((item) => item._id === payload._id) === -1)
      orders.value.push(payload)
  }

  function addOrdersToSchedule(payload: Order[]) {
    orders.value = orders.value.concat(
      payload.filter((i) => !orders.value.some((order) => order._id === i._id))
    )
  }

  function updateOrder(payload: Order) {
    const ind = orders.value.findIndex((item) => item._id === payload._id)
    if (ind !== -1) orders.value.splice(ind, 1, payload)
  }

  function deleteOrder(id: string) {
    orders.value = orders.value.filter((item) => item._id !== id)
  }

  function setOrderStatuses(payload: { value: string; text: string }[]) {
    orderStatuses.value = payload
  }

  function setOrderAnalyticTypes(payload: { value: string; text: string }[]) {
    orderAnalyticTypes.value = payload
  }

  function setOrderPriceTypes(payload: { value: string; text: string }[]) {
    orderPriceTypes.value = payload
  }

  function incScheduleDate(count: number) {
    scheduleDate.value = dayjs(scheduleDate.value).add(count, 'day').format('YYYY-MM-DD')
  }

  function setScheduleDate(newDate: string) {
    scheduleDate.value = newDate
  }

  function getOrdersForSchedule() {
    if (!schedulePeriod.value) return null
    OrderService.getListForSchedule()
  }

  return {
    orders,
    period,
    orderStatuses,
    scheduleDate,
    onlyPlannedDates,
    orderAnalyticTypes,
    orderPriceTypes,
    onlyTrucksWithRoutes,
    pointTypes,
    ordersForSchedule,
    ordersMap,
    orderCountByDates,
    schedulePeriod,
    orderStatusesMap,
    orderAnalyticTypesMap,
    orderPriceTypesMap,
    changeOnlyTrucksWithRoutes,
    changeOnlyPlannedDates,
    setPeriod,
    clearDirectories,
    setOrders,
    addOrder,
    addOrdersToSchedule,
    updateOrder,
    deleteOrder,
    setOrderStatuses,
    setOrderAnalyticTypes,
    setOrderPriceTypes,
    incScheduleDate,
    setScheduleDate,
    getOrdersForSchedule,
  }
})
