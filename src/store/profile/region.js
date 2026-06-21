import { RegionService } from '@/shared/services'

export default {
  state: {
    regions: [],
  },
  mutations: {
    setRegions(state, payload) {
      state.regions = payload
    },
  },
  actions: {
    async getRegions({ commit, getters }, directiveUpdate) {
      try {
        commit('setLoading', true)
        if (directiveUpdate || (getters.regions.length === 0 && getters.directoriesProfile)) {
          const regionList = await RegionService.getByDirectoriesProfile(getters.directoriesProfile)
          commit('setRegions', regionList)
        }
        commit('setLoading', false)
      } catch (e) {
        commit('setLoading', false)
        commit('setError', e.response?.data?.message)
      }
    },
  },
  getters: {
    regions: ({ regions }) => regions,
    regionsForAutocomplete: ({ regions }) =>
      regions.map((i) => ({ value: i._id, text: i.name, name: i.name })),
    regionsMap: ({ regions }) => new Map(regions.map((item) => [item._id, item])),
  },
}
