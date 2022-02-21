export default {
  state: {
    documentTypes: [],
    documentStatuses: [],
  },
  mutations: {
    setDocumentTypes(state, payload) {
      state.documentTypes = payload
    },
    setDocumentStatuses(state, payload) {
      state.documentStatuses = payload
    },
  },
  actions: {},
  getters: {
    documentTypes: ({ documentTypes }) => documentTypes,
    documentTypesMap: ({ documentTypes }) =>
      new Map(documentTypes.map((i) => [i.value, i.text])),
    documentStatuses: ({ documentStatuses }) => documentStatuses,
    documentStatusesMap: ({ documentStatuses }) =>
      new Map(documentStatuses.map((i) => [i.value, i.text])),
  },
}
