import service from '@/modules/profile/services/document.service'

export default {
  state: {
    documents: [],
  },
  mutations: {
    clearDirectories(state) {
      state.partners = []
    },
    setDocuments(state, payload) {
      state.documents = payload
    },
    addDocument(state, payload) {
      if (
        state.documents.findIndex((item) => item._id === payload._id) === -1
      ) {
        state.documents.push(payload)
      }
    },
    updateDocument(state, payload) {
      const ind = state.documents.findIndex((item) => item._id === payload._id)
      if (ind !== -1) state.documents.splice(ind, 1, payload)
    },
    deleteDocument(state, id) {
      state.documents = state.documents.filter((item) => item._id !== id)
    },
  },
  actions: {
    async getDocuments({ commit, getters }, directiveUpdate) {
      try {
        commit('setLoading', true)
        if (
          directiveUpdate ||
          (getters.documents.length === 0 && getters.directoriesProfile)
        ) {
          commit('setDocuments', [])
          const data = await service.getByDirectoriesProfile(
            getters.directoriesProfile
          )
          commit('setDocuments', data)
        }
        commit('setLoading', false)
      } catch (e) {
        commit('setLoading', false)
        commit('setError', e.response?.data?.message)
      }
    },
  },
  getters: {
    documentsMap: ({ documents }) =>
      new Map(documents.map((item) => [item._id, item])),
    documents: ({ documents }, { directoriesProfile }) =>
      documents
        .filter((item) => item.company === directoriesProfile)
        .sort((a, b) => {
          if (a.name < b.name) return -1
          if (a.name > b.name) return 1
        }),
    documentsForTariff: ({ documents }) =>
      documents.filter((i) => i.useInTariff),
  },
}
