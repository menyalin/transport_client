import moment from 'moment'
import service from '../services/order.service'

const _getLastPlannedDate = (order) => {
  const tmpRoute = order.route.slice()
  tmpRoute.shift()
  const plannedDates = tmpRoute
    .filter((point) => !!point.plannedDate)
    .map((point) => point.plannedDate)
    .reverse()
  return plannedDates.length ? plannedDates[0] : null
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
  },
  mutations: {
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
    getOrders({ commit, getters }) {
      if (!getters.directoriesProfile) {
        commit('setError', 'Профиль настроек не установлен')
        return null
      }
      service
        .getByDirectoriesProfile({
          profile: getters.directoriesProfile,
          startDate: getters.schedulePeriod[0],
          endDate: getters.schedulePeriod[1],
        })
        .then((res) => {
          commit('setOrders', res)
        })
        .catch((e) => {
          commit('setError', e.message)
        })
    },
  },
  getters: {
    pointTypes: ({ pointTypes }) => pointTypes,
    ordersForSchedule: ({ orders }) =>
      orders
        .map((item) => ({
          _id: item._id,
          company: item.company,
          startPositionDate: item.startPositionDate,
          endPositionDate: _getLastPlannedDate(item),
          truckId: item.confirmedCrew?.truck,
          isDisabled: item.isDisabled,
          state: item.state,
        }))
        .sort(
          (a, b) =>
            new Date(a.startPositionDate) - new Date(b.startPositionDate)
        ),
    schedulePeriod: ({ period }) => [
      period[0],
      moment(period[1]).add(1, 'd').format('YYYY-MM-DD'),
    ],
    scheduleDate: ({ scheduleDate }) => scheduleDate,
    orderStatuses: ({ orderStatuses }) => orderStatuses,
  },
}
