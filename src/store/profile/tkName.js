import { CarrierService } from '@/shared/services'

export default {
  state: {
    tkNames: [],
  },
  mutations: {
    clearDirectories(state) {
      state.tkNames = []
    },
    setTkNames(state, payload) {
      state.tkNames = payload
    },
    addTkName(state, payload) {
      if (state.tkNames.findIndex(item => item._id === payload._id) === -1) {
        state.tkNames.push(payload)
      }
    },
    updateTkName(state, payload) {
      const ind = state.tkNames.findIndex(item => item._id === payload._id)
      if (ind !== -1) state.tkNames.splice(ind, 1, payload)
    },
    deleteTkName(state, id) {
      state.tkNames = state.tkNames.filter(item => item._id !== id)
    },
  },
  actions: {
    createTkName({ commit }, payload) {
      return new Promise((resolve, reject) => {
        commit('setLoading', true)
        CarrierService.create(payload)
          .then(data => {
            commit('addTkName', data)
            commit('setLoading', false)
            resolve(data)
          })
          .catch(e => {
            commit('setLoading', false)
            commit('setError', e)
            reject(e)
          })
      })
    },

    async getTkNames({ commit, getters }, directiveUpdate) {
      try {
        commit('setLoading', true)
        if (directiveUpdate || (getters.routeSheets.length === 0 && getters.directoriesProfile)) {
          commit('setTkNames', [])
          const data = await CarrierService.getByDirectoriesProfile(getters.directoriesProfile)
          commit('setTkNames', data)
        }
        commit('setLoading', false)
      } catch (e) {
        commit('setLoading', false)
        commit('setError', e.response?.data?.message)
      }
    },
  },
  getters: {
    tkNames: ({ tkNames }) =>
      tkNames.sort((a, b) => {
        if (a.name < b.name) return -1
        if (a.name > b.name) return 1
      }),

    tkNamesMap: ({ tkNames }) => {
      let map = new Map()
      tkNames.forEach(item => {
        map.set(item._id, item)
      })
      return map
    },

    tkNamesForSelect: ({ tkNames }) => tkNames.map(i => ({ ...i, value: i._id, text: i.name })),
  },
}
