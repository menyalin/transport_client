export default {
  state: {
    orderTemplates: [],
  },
  mutations: {
    clearDirectories(state) {
      state.partners = []
    },
    setOrderTemplates(state, payload) {
      state.orderTemplates = payload
    },
    addOrderTemplate(state, payload) {
      if (state.orderTemplates.findIndex((item) => item._id === payload._id) === -1) {
        state.orderTemplates.push(payload)
      }
    },
    updateOrderTemplate(state, payload) {
      const ind = state.orderTemplates.findIndex((item) => item._id === payload._id)
      if (ind !== -1) state.orderTemplates.splice(ind, 1, payload)
    },
    deleteOrderTemplate(state, id) {
      state.orderTemplates = state.orderTemplates.filter((item) => item._id !== id)
    },
  },
  actions: {},
  getters: {
    orderTemplates: ({ orderTemplates }) => orderTemplates,
    orderTemplatesMap: ({ orderTemplates }) =>
      new Map(orderTemplates.map((item) => [item._id, item])),
  },
}
