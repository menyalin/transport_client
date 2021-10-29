import service from '@/modules/profile/services/partner.service'

export default {
  state: {
    partners: [],
  },
  mutations: {
    clearDirectories(state) {
      state.partners = []
    },
    setPartners(state, payload) {
      state.partners = payload
    },
    addPartner(state, payload) {
      if (state.partners.findIndex((item) => item._id === payload._id) === -1) {
        state.partners.push(payload)
      }
    },
    updatePartner(state, payload) {
      const ind = state.partners.findIndex((item) => item._id === payload._id)
      if (ind !== -1) state.partners.splice(ind, 1, payload)
    },
    deletePartner(state, id) {
      state.partners = state.partners.filter((item) => item._id !== id)
    },
  },
  actions: {
    createPartner({ commit }, payload) {
      return new Promise(async (resolve, reject) => {
        try {
          commit('setLoading', true)
          const data = await service.create(payload)
          commit('addPartner', data)
          commit('setLoading', false)
          resolve(data)
        } catch (e) {
          commit('setLoading', false)
          commit('setError', e)
          reject(e)
        }
      })
    },

    async getPartners({ commit, getters }, directiveUpdate) {
      try {
        commit('setLoading', true)
        if (
          directiveUpdate ||
          (getters.partners.length === 0 && getters.directoriesProfile)
        ) {
          commit('setPartners', [])
          const data = await service.getByDerictoriesProfile(
            getters.directoriesProfile
          )
          commit('setPartners', data)
        }
        commit('setLoading', false)
      } catch (e) {
        commit('setLoading', false)
        commit('setError', e.response?.data?.message)
      }
    },
  },
  getters: {
    partners: ({ partners }) =>
      partners.sort((a, b) => {
        if (a.name < b.name) return -1
        if (a.name > b.name) return 1
      }),
    partnersForAutocomplete: ({ partners }) =>
      partners.map((item) => ({
        value: item._id,
        text: item.name,
      })),
  },
}
