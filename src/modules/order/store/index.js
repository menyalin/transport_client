import { OrderService } from '@/shared/services'
import dayjs from 'dayjs'

const _getStartPositionDate = (order) => {
  return order.route[0]?.arrivalDate ? order.route[0].arrivalDate : order.startPositionDate
}

const _getLastPlannedDate = (order) => {
  const tmpRoute = order.route.slice()
  tmpRoute.shift()
  let plannedDates = []
  for (let point of tmpRoute) {
    plannedDates.push(point.plannedDate)
  }
  plannedDates = plannedDates.filter((x) => !!x).sort((a, b) => new Date(b) - new Date(a))
  return plannedDates.length ? plannedDates[0] : null
}

const _getLastPositionDate = (order) => {
  const tmpRoute = order.route.slice()
  if (tmpRoute[tmpRoute.length - 1].departureDate)
    return tmpRoute[tmpRoute.length - 1].departureDate
  let routeDates = []
  routeDates.push(order.startPositionDate)
  for (let i = 0; i < tmpRoute.length; i++) {
    if (i !== 0) routeDates.push(tmpRoute[i].plannedDate)
    routeDates.push(tmpRoute[i].arrivalDate)
    routeDates.push(tmpRoute[i].departureDate)
  }
  routeDates = routeDates.filter((date) => !!date)
  return routeDates.sort((a, b) => new Date(b) - new Date(a))[0]
}

function _computeOrdersForSchedule(orders, period, onlyPlannedDates) {
  const schedulePeriod =
    period.length === 2 ? [period[0], dayjs(period[1]).add(1, 'd').format('YYYY-MM-DD')] : null

  return orders
    .map((item) => ({
      _id: item._id,
      company: item.company,
      needRoundTime: !item.route[0]?.arrivalDate || onlyPlannedDates || !item.confirmedCrew?.truck,
      isCompleted: !!item.route[item.route.length - 1]?.departureDate,
      startPositionDate: onlyPlannedDates ? item.startPositionDate : _getStartPositionDate(item),
      endPositionDate: onlyPlannedDates ? item.startPositionDate : _getLastPositionDate(item),
      lastPlannedDate: _getLastPlannedDate(item),
      truckId: item.confirmedCrew?.truck,
      isDisabled: item.isDisabled,
      state: item.state,
      route: item.route,
    }))
    .filter((order) => {
      if (period.length !== 2) return true
      const sP = dayjs(schedulePeriod[0])
      const eP = dayjs(schedulePeriod[1])
      return eP.isAfter(order.startPositionDate) && sP.isSameOrBefore(order.endPositionDate)
    })
    .sort((a, b) => new Date(a.startPositionDate) - new Date(b.startPositionDate))
}

function _updateCache(state) {
  state._ordersForScheduleCache = _computeOrdersForSchedule(
    state.orders,
    state.period,
    state.onlyPlannedDates
  )
}

function _updateOrdersDerived(state) {
  state._ordersMapCache = new Map(state.orders.map((item) => [item._id, item]))

  const tmpRes = new Map()
  if (state.orders.length) {
    const filteredOrders = state.orders.filter((o) => o.confirmedCrew?.truck)
    filteredOrders.forEach((order) => {
      const dayStr = dayjs(order.startPositionDate).format('YYYY-MM-DD')
      const zone = _getZoneName(order.startPositionDate)
      const existing = tmpRes.get(dayStr)
      const newDay = {
        ...existing,
        totalInDay: existing ? existing.totalInDay + 1 : 1,
        [zone]: existing?.[zone] ? existing[zone] + 1 : 1,
      }
      tmpRes.set(dayStr, newDay)
    })
  }
  state._orderCountByDatesCache = tmpRes
}

function _updateAllCaches(state) {
  _updateCache(state)
  _updateOrdersDerived(state)
}

export default {
  state: {
    orders: [],
    period: [],
    pointTypes: [
      { value: 'loading', text: 'Погрузка' },
      { value: 'unloading', text: 'Выгрузка' },
    ],
    orderStatuses: [],
    scheduleDate: dayjs().format('YYYY-MM-DD'),
    onlyPlannedDates: localStorage.getItem('orders:onlyPlannedDates') === 'true',
    orderAnalyticTypes: [],
    orderPriceTypes: [],
    onlyTrucksWithRoutes: localStorage.getItem('orders:onlyTrucksWithRoutes') !== 'false',
    _ordersForScheduleCache: [],
    _ordersMapCache: new Map(),
    _orderCountByDatesCache: new Map(),
  },
  mutations: {
    changeOnlyTrucksWithRoutes(state) {
      state.onlyTrucksWithRoutes = !state.onlyTrucksWithRoutes
      localStorage.setItem('orders:onlyTrucksWithRoutes', state.onlyTrucksWithRoutes)
    },

    changeOnlyPlannedDates(state) {
      state.onlyPlannedDates = !state.onlyPlannedDates
      if (!state.onlyPlannedDates) localStorage.removeItem('orders:onlyPlannedDates')
      else localStorage.setItem('orders:onlyPlannedDates', true)
      _updateCache(state)
    },
    setPeriod(state, payload) {
      state.period = payload
      _updateCache(state)
    },
    clearDirectories(state) {
      state.orders = []
      _updateAllCaches(state)
    },
    setOrders(state, payload) {
      state.orders = payload
      _updateAllCaches(state)
    },
    addOrder(state, payload) {
      if (state.orders.findIndex((item) => item._id === payload._id) === -1)
        state.orders.push(payload)
      _updateAllCaches(state)
    },
    addOrdersToSchedule(state, payload) {
      state.orders = state.orders.concat(
        payload.filter((i) => !state.orders.some((order) => order._id === i._id))
      )
      _updateAllCaches(state)
    },
    updateOrder(state, payload) {
      const ind = state.orders.findIndex((item) => item._id === payload._id)
      if (ind !== -1) state.orders.splice(ind, 1, payload)
      _updateAllCaches(state)
    },
    deleteOrder(state, id) {
      state.orders = state.orders.filter((item) => item._id !== id)
      _updateAllCaches(state)
    },

    setOrderStatuses(state, payload) {
      state.orderStatuses = payload
    },
    setOrderAnalyticTypes(state, payload) {
      state.orderAnalyticTypes = payload
    },
    setOrderPriceTypes(state, payload) {
      state.orderPriceTypes = payload
    },
    incScheduleDate(state, count) {
      state.scheduleDate = dayjs(state.scheduleDate).add(count, 'day').format('YYYY-MM-DD')
    },
    setScheduleDate(state, newDate) {
      state.scheduleDate = newDate
    },
  },
  actions: {
    getOrdersForSchedule({ commit, getters }) {
      if (!getters.schedulePeriod) return null
      if (!getters.directoriesProfile) {
        commit('setError', 'Профиль настроек не установлен')
        return null
      }
      OrderService.getListForSchedule()
    },
  },
  getters: {
    onlyTrucksWithRoutes: ({ onlyTrucksWithRoutes }) => onlyTrucksWithRoutes,
    pointTypes: ({ pointTypes }) => pointTypes,
    ordersForSchedule: (state) => state._ordersForScheduleCache,
    schedulePeriod: ({ period }) => {
      if (period.length !== 2) return null
      return [period[0], dayjs(period[1]).add(1, 'd').format('YYYY-MM-DD')]
    },
    scheduleDate: ({ scheduleDate }) => scheduleDate,
    orderStatuses: ({ orderStatuses }) => orderStatuses,
    orderStatusesMap: ({ orderStatuses }) =>
      new Map(orderStatuses.map((item) => [item.value, item.text])),
    orderAnalyticTypes: ({ orderAnalyticTypes }) => orderAnalyticTypes,
    orderAnalyticTypesMap: ({ orderAnalyticTypes }) =>
      new Map(orderAnalyticTypes.map((item) => [item.value, item.text])),

    ordersMap: (state) => state._ordersMapCache,
    onlyPlannedDates: ({ onlyPlannedDates }) => onlyPlannedDates,
    orderPriceTypes: ({ orderPriceTypes }) => orderPriceTypes,

    orderCountByDates: (state) => state._orderCountByDatesCache,

    orderPriceTypesMap: ({ orderPriceTypes }) =>
      new Map(orderPriceTypes.map((t) => [t.value, t.text])),
  },
}
const _getZoneName = (date) => {
  const hours = new Date(date).getHours()
  if (hours < 6) return '00-06'
  if (hours < 12) return '06-12'
  if (hours < 18) return '12-18'
  return '18-24'
}
