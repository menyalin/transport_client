import RouteSheetService from '@/modules/profile/services/routeSheet.service'

export default {
  state: {
    routeSheets: [],
  },
  mutations: {
    clearDirectories(state) {
      state.routeSheets = []
    },
    setRouteSheets(state, payload) {
      state.routeSheets = payload
    },
    addRouteSheet(state, payload) {
      if (
        state.routeSheets.findIndex((item) => item._id === payload._id) === -1
      ) {
        state.routeSheets.push(payload)
      }
    },
    updateRouteSheet(state, payload) {
      const ind = state.routeSheets.findIndex(
        (item) => item._id === payload._id
      )
      if (ind !== -1) state.routeSheets.splice(ind, 1, payload)
    },
    deleteRouteSheet(state, id) {
      state.routeSheets = state.routeSheets.filter((item) => item._id !== id)
    },
  },
  actions: {
    createRouteSheet({ commit }, payload) {
      return new Promise(async (resolve, reject) => {
        try {
          commit('setLoading', true)
          const data = await RouteSheetService.create(payload)
          commit('addRouteSheet', data)
          commit('setLoading', false)
          resolve(data)
        } catch (e) {
          commit('setLoading', false)
          commit('setError', e)
          reject(e)
        }
      })
    },

    async getRouteSheets({ commit, getters }, directiveUpdate) {
      try {
        commit('setLoading', true)
        if (
          directiveUpdate ||
          (getters.routeSheets.length === 0 && getters.directoriesProfile)
        ) {
          commit('setRouteSheets', [])
          const data = await RouteSheetService.getByDerictoriesProfile(
            getters.directoriesProfile
          )
          commit('setRouteSheets', data)
        }
        commit('setLoading', false)
      } catch (e) {
        commit('setLoading', false)
        commit('setError', e.response?.data?.message)
      }
    },
  },
  getters: {
    routeSheets: ({ routeSheets }) => routeSheets,
  },
}
