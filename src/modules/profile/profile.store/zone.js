import service from '@/modules/profile/services/zone.service'

export default {
  state: {
    zones: [],
  },
  mutations: {
    clearDirectories(state) {
      state.zones = []
    },
    setZones(state, payload) {
      state.zones = payload
    },
    addZone(state, payload) {
      if (state.zones.findIndex((item) => item._id === payload._id) === -1) {
        state.zones.push(payload)
      }
    },
    updateZone(state, payload) {
      const ind = state.zones.findIndex((item) => item._id === payload._id)
      if (ind !== -1) state.zones.splice(ind, 1, payload)
    },
    deleteZone(state, id) {
      state.zones = state.zones.filter((item) => item._id !== id)
    },
  },
  actions: {
    async getZones({ commit, getters }, directiveUpdate) {
      try {
        commit('setLoading', true)
        if (
          directiveUpdate ||
          (getters.zones.length === 0 && getters.directoriesProfile)
        ) {
          commit('setZones', [])
          const data = await service.getByDirectoriesProfile(
            getters.directoriesProfile
          )
          commit('setZones', data)
        }
        commit('setLoading', false)
      } catch (e) {
        commit('setLoading', false)
        commit('setError', e.response?.data?.message)
      }
    },
  },
  getters: {
    zonesMap: ({ zones }) => new Map(zones.map((item) => [item._id, item])),
    zonesForAutocomplete: ({ zones }) =>
      zones
        .map((i) => ({ text: i.name, value: i._id }))
        .sort((a, b) => {
          if (a.text.toLowerCase() < b.text.toLowerCase()) return -1
          if (a.text.toLowerCase() > b.text.toLowerCase()) return 1
        }),
    zones: ({ zones }, { directoriesProfile }) =>
      zones
        .filter((item) => item.company === directoriesProfile)
        .sort((a, b) => {
          if (a.name.toLowerCase() < b.name.toLowerCase()) return -1
          if (a.name.toLowerCase() > b.name.toLowerCase()) return 1
        }),
  },
}
