import { ZoneService } from '@/shared/services'

export default {
  state: {
    zones: [],
  },
  mutations: {
    setZones(state, payload) {
      state.zones = payload
    },
  },
  actions: {
    async getZones({ commit, getters }, directiveUpdate) {
      try {
        commit('setLoading', true)
        if (directiveUpdate || (getters.zones.length === 0 && getters.directoriesProfile)) {
          const zoneList = await ZoneService.getByDirectoriesProfile(getters.directoriesProfile)
          commit('setZones', zoneList)
        }
        commit('setLoading', false)
      } catch (e) {
        commit('setLoading', false)
        commit('setError', e.response?.data?.message)
      }
    },
  },
  getters: {
    zones: ({ zones }) => zones,
    zonesForAutocomplete: ({ zones }) =>
      zones.map((i) => ({ value: i._id, text: i.name, name: i.name })),
    zonesMap: ({ zones }) => new Map(zones.map((item) => [item._id, item])),
  },
}
