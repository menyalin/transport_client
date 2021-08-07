import service from '@/modules/profile/services/crew.service'

export default {
  state: {
    crews: [],
  },
  mutations: {
    clearDirectories(state) {
      state.crews = []
    },
    setCrews(state, payload) {
      state.crews = payload
    },
    addCrew(state, payload) {
      if (state.crews.findIndex((item) => item._id === payload._id) === -1) {
        state.crews.push(payload)
      }
    },
    updateCrew(state, payload) {
      const ind = state.crews.findIndex((item) => item._id === payload._id)
      if (ind !== -1) state.crews.splice(ind, 1, payload)
    },
    deleteCrew(state, id) {
      state.crews = state.crews.filter((item) => item._id !== id)
    },
  },
  actions: {
    createCrew({ commit }, payload) {
      return new Promise(async (resolve, reject) => {
        try {
          commit('setLoading', true)
          const data = await service.create(payload)
          commit('addCrew', data)
          commit('setLoading', false)
          resolve(data)
        } catch (e) {
          commit('setLoading', false)
          commit('setError', e)
          reject(e)
        }
      })
    },

    async getCrews({ commit, getters }, directiveUpdate) {
      try {
        commit('setLoading', true)
        if (
          directiveUpdate ||
          (getters.crews.length === 0 && getters.directoriesProfile)
        ) {
          commit('setCrews', [])
          const data = await service.getByDerictoriesProfile(
            getters.directoriesProfile
          )
          commit('setCrews', data)
        }
        commit('setLoading', false)
      } catch (e) {
        commit('setLoading', false)
        commit('setError', e.response?.data?.message)
      }
    },
  },
  getters: {
    crews: ({ crews }) => crews,
  },
}
