import { RegionService } from '@/shared/services'

export default {
  state: {
    regions: [],
  },
  mutations: {
    clearDirectories(state) {
      state.regions = []
    },
    setRegions(state, payload) {
      state.regions = payload
    },
    addRegion(state, payload) {
      if (state.regions.findIndex((item) => item._id === payload._id) === -1) {
        state.regions.push(payload)
      }
    },
    updateRegion(state, payload) {
      const ind = state.regions.findIndex((item) => item._id === payload._id)
      if (ind !== -1) state.regions.splice(ind, 1, payload)
    },
    deleteRegion(state, id) {
      state.regions = state.regions.filter((item) => item._id !== id)
    },
  },
  actions: {
    async getRegions({ commit, getters }, directiveUpdate) {
      try {
        commit('setLoading', true)
        if (
          directiveUpdate ||
          (getters.regions.length === 0 && getters.directoriesProfile)
        ) {
          commit('setRegions', [])
          const data = await RegionService.getByDirectoriesProfile(
            getters.directoriesProfile
          )
          commit('setRegions', data)
        }
        commit('setLoading', false)
      } catch (e) {
        commit('setLoading', false)
        commit('setError', e.response?.data?.message)
      }
    },
  },
  getters: {
    regionsMap: ({ regions }) =>
      new Map(regions.map((item) => [item._id, item])),
    regionsForAutocomplete: ({ regions }) =>
      regions
        .map((i) => ({ text: i.name, value: i._id }))
        .sort((a, b) => {
          if (a.text.toLowerCase() < b.text.toLowerCase()) return -1
          if (a.text.toLowerCase() > b.text.toLowerCase()) return 1
        }),
    regions: ({ regions }, { directoriesProfile }) =>
      regions
        .filter((item) => item.company === directoriesProfile)
        .sort((a, b) => {
          if (a.name.toLowerCase() < b.name.toLowerCase()) return -1
          if (a.name.toLowerCase() > b.name.toLowerCase()) return 1
        }),
  },
}
