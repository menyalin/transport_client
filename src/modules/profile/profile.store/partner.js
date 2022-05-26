import service from '@/modules/profile/services/partner.service'

export default {
  state: {
    partners: [],
    partnerGroups: [],
  },
  mutations: {
    clearDirectories(state) {
      state.partners = []
    },
    setPartners(state, payload) {
      state.partners = payload
    },
    setPartnerGroups(state, payload) {
      state.partnerGroups = payload
    },
    addPartner(state, payload) {
      if (state.partners.findIndex((item) => item._id === payload._id) === -1) {
        state.partners.push(payload)
      }
    },
    updatePartner(state, payload) {
      const ind = state.partners.findIndex((item) => item._id === payload._id)
      if (ind !== -1) state.partners.splice(ind, 1, payload)
    },
    deletePartner(state, id) {
      state.partners = state.partners.filter((item) => item._id !== id)
    },
  },
  actions: {
    async getPartners({ commit, getters }, directiveUpdate) {
      try {
        commit('setLoading', true)
        if (
          directiveUpdate ||
          (getters.partners.length === 0 && getters.directoriesProfile)
        ) {
          commit('setPartners', [])
          const data = await service.getByDirectoriesProfile(
            getters.directoriesProfile
          )
          commit('setPartners', data)
        }
        commit('setLoading', false)
      } catch (e) {
        commit('setLoading', false)
        commit('setError', e.response?.data?.message)
      }
    },
  },
  getters: {
    partnersMap: ({ partners }) =>
      new Map(partners.map((item) => [item._id, item])),
    partners: ({ partners }, { directoriesProfile }) =>
      partners
        .filter((item) => item.company === directoriesProfile)
        .sort((a, b) => {
          if (a.name < b.name) return -1
          if (a.name > b.name) return 1
        }),
    partnersForAutocomplete: ({ partners }, { directoriesProfile }) =>
      partners
        .filter((item) => item.company === directoriesProfile)
        .map((item) => ({
          value: item._id,
          text: item.name,
          ...item,
        })),
    partnerGroups: ({ partnerGroups }) => partnerGroups,
    partnerGroupsMap: ({ partnerGroups }) =>
      new Map(partnerGroups.map((i) => [i.value, i.text])),
  },
}
