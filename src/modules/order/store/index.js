import moment from 'moment'
import service from '../services/order.service'

export default {
  state: {
    orders: [],
    period: [],
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
    ordersForSchedule: ({ orders }) =>
      orders.map((item) => ({
        _id: item._id,
        company: item.company,
        startPositionDate: item.startPositionDate,
        endPositionDate: item.endPositionDate,
        truckId: item.truck,
        isDisabled: item.isDisabled,
      })),
    schedulePeriod: ({ period }) => [
      period[0],
      moment(period[1]).add(1, 'd').format('YYYY-MM-DD'),
    ],
  },
}
