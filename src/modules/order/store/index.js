import service from '../services/order.service'

const _initDateRange = () => {
  return ['2021-08-01', '2021-08-16']
}

export default {
  state: {
    orders: [],
    ordersDateRange: _initDateRange(),
  },
  mutations: {
    clearDirectories(state) {
      state.orders = []
    },
    setOrders({ orders }, payload) {
      orders = payload
    },
    addOrder({ orders }, payload) {
      if (orders.findIndex((item) => item._id === payload._id) === -1)
        orders.push(payload)
    },
    updateOrder({ orders }, payload) {
      const ind = orders.findIndex((item) => item._id === payload._id)
      if (ind !== -1) orders.splice(ind, 1, payload)
    },
    deleteTruck(state, id) {
      state.orders = state.orders.filter((item) => item._id !== id)
    },
  },
  actions: {
    getOrders({ commit, getters }) {
      if (!getters.directoriesProfile) {
        commit('setError', 'Профиль настроек не определен')
        return null
      }
      if (!isValidOrdersDateRange) {
        commit('setError', 'Временной интервал не задан')
        return null
      }
    },
  },
  getters: {
    isValidOrdersDateRange: ({ ordersDateRange }) => true,
    ordersDateRange: ({ ordersDateRange }) => ordersDateRange,
  },
}
