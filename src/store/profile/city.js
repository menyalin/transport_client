import { CityService } from '@/shared/services'

export default {
  state: {
    cities: [],
  },
  mutations: {
    setCities(state, payload) {
      state.cities = payload
    },
  },
  actions: {
    async getCities({ commit, getters }, directiveUpdate) {
      try {
        commit('setLoading', true)
        if (directiveUpdate || (getters.cities.length === 0 && getters.directoriesProfile)) {
          const cityList = await CityService.getByDirectoriesProfile(getters.directoriesProfile)
          commit('setCities', cityList)
        }
        commit('setLoading', false)
      } catch (e) {
        commit('setLoading', false)
        commit('setError', e.response?.data?.message)
      }
    },
  },
  getters: {
    cities: ({ cities }) => cities,
    citiesMap: ({ cities }) => new Map(cities.map((item) => [item._id, item])),
  },
}
