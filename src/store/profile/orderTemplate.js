import { OrderTemplateService } from '@/shared/services'

export default {
  state: {
    orderTemplates: [],
  },
  mutations: {
    clearDirectories(state) {
      state.orderTemplates = []
    },
    setOrderTemplates(state, payload) {
      state.orderTemplates = payload
    },
    addOrderTemplate(state, payload) {
      if (state.orderTemplates.findIndex(item => item._id === payload._id) === -1) {
        state.orderTemplates.push(payload)
      }
    },
    updateOrderTemplate(state, payload) {
      const ind = state.orderTemplates.findIndex(item => item._id === payload._id)
      if (ind !== -1) state.orderTemplates.splice(ind, 1, payload)
    },
    deleteOrderTemplate(state, id) {
      state.orderTemplates = state.orderTemplates.filter(item => item._id !== id)
    },
  },
  actions: {
    async getOrderTemplates({ commit, getters }) {
      try {
        const res = await OrderTemplateService.getList({
          company: getters.directoriesProfile,
        })
        if (res.length) commit('setOrderTemplates', res)
      } catch (e) {
        commit('setError', e.message)
      }
    },
  },
  getters: {
    orderTemplates: ({ orderTemplates }) => orderTemplates,
    orderTemplatesMap: ({ orderTemplates }) => new Map(orderTemplates.map(item => [item._id, item])),
    orderTemplatesForSelect: ({ orderTemplates }) =>
      orderTemplates.map(o => ({
        value: o._id,
        text: o.name,
      })),
  },
}
