import CompanyService from './services/company.service'

export default {
  state: {
    myCompanies: [],
  },
  mutations: {
    setMyCompanies(state, companies) {
      state.myCompanies = companies
    },
  },
  actions: {
    async getMyCompanies({ commit }) {
      try {
        commit('setLoading', true)
        const companies = await CompanyService.getMyCompanies()
        commit('setLoading', false)
        commit('setMyCompanies', companies)
      } catch (e) {
        commit('setLoading', false)
        dispatch('setError', e.message)
      }
    },
  },
  getters: {},
}
