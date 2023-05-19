import {CityService} from '@/shared/services'

export default {
  state: {
    cities: [],
  },
  mutations: {
    clearDirectories(state) {
      state.cities = []
    },
    setCities(state, payload) {
      state.cities = payload
    },
    addCity(state, payload) {
      if (state.cities.findIndex((item) => item._id === payload._id) === -1) {
        state.cities.push(payload)
      }
    },
    updateCity(state, payload) {
      const ind = state.cities.findIndex((item) => item._id === payload._id)
      if (ind !== -1) state.cities.splice(ind, 1, payload)
    },
    deleteCity(state, id) {
      state.cities = state.cities.filter((item) => item._id !== id)
    },
  },
  actions: {
    async getCities({ commit, getters }, directiveUpdate) {
      try {
        commit('setLoading', true)
        if (
          directiveUpdate ||
          (getters.cities.length === 0 && getters.directoriesProfile)
        ) {
          commit('setCities', [])
          const data = await CityService.getByDirectoriesProfile(
            getters.directoriesProfile
          )
          commit('setCities', data)
        }
        commit('setLoading', false)
      } catch (e) {
        commit('setLoading', false)
        commit('setError', e.response?.data?.message)
      }
    },
  },
  getters: {
    citiesMap: ({ cities }) => new Map(cities.map((item) => [item._id, item])),
    citiesForAutocomplete: ({ cities }) =>
      cities
        .map((i) => ({ text: i.name, value: i._id }))
        .sort((a, b) => {
          if (a.text.toLowerCase() < b.text.toLowerCase()) return -1
          if (a.text.toLowerCase() > b.text.toLowerCase()) return 1
        }),
    cities: ({ cities }, { directoriesProfile }) =>
      cities
        .filter((item) => item.company === directoriesProfile)
        .sort((a, b) => {
          if (a.name.toLowerCase() < b.name.toLowerCase()) return -1
          if (a.name.toLowerCase() > b.name.toLowerCase()) return 1
        }),
  },
}
