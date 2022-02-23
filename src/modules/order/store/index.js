import moment from 'moment'
import service from '../services/order.service'

const _getStartPositionDate = (order) => {
  return order.route[0]?.arrivalDate
    ? order.route[0].arrivalDate
    : order.startPositionDate
}

const _getLastPlannedDate = (order) => {
  const tmpRoute = order.route.slice()
  tmpRoute.shift()
  let plannedDates = []
  for (let point of tmpRoute) {
    plannedDates.push(point.plannedDate)
  }
  plannedDates = plannedDates
    .filter((x) => !!x)
    .sort((a, b) => new Date(b) - new Date(a))
  return plannedDates.length ? plannedDates[0] : null
}

const _getLastPositionDate = (order) => {
  const tmpRoute = order.route.slice()
  if (!!tmpRoute[tmpRoute.length - 1].departureDate)
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

export default {
  state: {
    orders: [],
    period: [],
    pointTypes: [
      { value: 'loading', text: 'Погрузка' },
      { value: 'unloading', text: 'Выгрузка' },
    ],
    orderStatuses: [],
    scheduleDate: moment().format('YYYY-MM-DD'),
    onlyPlannedDates: false,
    orderAnalyticTypes: [],
    orderPriceTypes: [],
  },
  mutations: {
    changeOnlyPlannedDates(state) {
      state.onlyPlannedDates = !state.onlyPlannedDates
    },
    setPeriod(state, payload) {
      state.period = payload
    },
    clearDirectories(state) {
      state.orders = []
    },
    setOrders(state, payload) {
      state.orders = payload
    },
    addOrder({ orders }, payload) {
      if (orders.findIndex((item) => item._id === payload._id) === -1)
        orders.push(payload)
    },
    updateOrder(state, payload) {
      const ind = state.orders.findIndex((item) => item._id === payload._id)
      if (ind !== -1) state.orders.splice(ind, 1, payload)
    },
    deleteOrder(state, id) {
      state.orders = state.orders.filter((item) => item._id !== id)
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
      state.scheduleDate = moment(state.scheduleDate)
        .add(count, 'day')
        .format('YYYY-MM-DD')
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
      service.getListForSchedule()
    },
  },
  getters: {
    pointTypes: ({ pointTypes }) => pointTypes,
    ordersForSchedule: (
      { orders },
      { schedulePeriod, onlyPlannedDates, hiddenTruckIds }
    ) =>
      orders
        .map((item) => ({
          _id: item._id,
          company: item.company,
          needRoundTime: !item.route[0].arrivalDate || onlyPlannedDates,
          isCompleted: !!item.route[item.route.length - 1]?.departureDate,
          startPositionDate: onlyPlannedDates
            ? item.startPositionDate
            : _getStartPositionDate(item),
          endPositionDate: onlyPlannedDates
            ? item.startPositionDate
            : _getLastPositionDate(item), // для определения длины блока
          lastPlannedDate: _getLastPlannedDate(item), // для проверки при перемещении
          truckId: item.confirmedCrew?.truck,
          isDisabled: item.isDisabled,
          state: item.state,
          route: item.route,
        }))
        .filter((order) => {
          const sP = moment(schedulePeriod[0])
          const eP = moment(schedulePeriod[1])
          return (
            eP.isAfter(order.startPositionDate) &&
            sP.isSameOrBefore(order.endPositionDate) &&
            (!order.truckId || !hiddenTruckIds.includes(order.truckId))
          )
        })

        .sort(
          (a, b) =>
            new Date(a.startPositionDate) - new Date(b.startPositionDate)
        ),
    schedulePeriod: ({ period }) => {
      if (period.length !== 2) return null
      return [period[0], moment(period[1]).add(1, 'd').format('YYYY-MM-DD')]
    },
    scheduleDate: ({ scheduleDate }) => scheduleDate,
    orderStatuses: ({ orderStatuses }) => orderStatuses,
    orderStatusesMap: ({ orderStatuses }) =>
      new Map(orderStatuses.map((item) => [item.value, item.text])),
    orderAnalyticTypes: ({ orderAnalyticTypes }) => orderAnalyticTypes,
    orderAnalyticTypesMap: ({ orderAnalyticTypes }) =>
      new Map(orderAnalyticTypes.map((item) => [item.value, item.text])),

    ordersMap: ({ orders }) => new Map(orders.map((item) => [item._id, item])),
    onlyPlannedDates: ({ onlyPlannedDates }) => onlyPlannedDates,
    orderPriceTypes: ({ orderPriceTypes }) => orderPriceTypes,
    orderCountByDates: ({ orders }, { ordersForSchedule }) => {
      let tmpRes = new Map()
      const filteredOrders = orders.filter((o) => o.confirmedCrew?.truck)
      for (let i = 0; i < filteredOrders.length; i++) {
        const key = moment(filteredOrders[i].startPositionDate).format(
          'YYYY-MM-DD'
        )
        if (tmpRes.has(key)) {
          const lastVal = tmpRes.get(key)
          tmpRes.set(key, { totalInDate: (lastVal.totalInDate += 1) })
        } else {
          tmpRes.set(key, { totalInDate: 1 })
        }
      }
      return tmpRes
    },
    orderPriceTypesMap: ({ orderPriceTypes }) =>
      new Map(orderPriceTypes.map((t) => [t.value, t.text])),
  },
}
