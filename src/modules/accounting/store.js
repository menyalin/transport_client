export default {
  state: {
    documentTypes: [],
    documentStatuses: [],
    salaryTariffTypes: [],
    docsRegistryStatuses: [],
  },
  mutations: {
    setDocumentTypes(state, payload) {
      state.documentTypes = payload
    },
    setDocumentStatuses(state, payload) {
      state.documentStatuses = payload
    },
    setSalaryTariffTypes(state, payload) {
      state.salaryTariffTypes = payload
    },
    setDocsRegistryStatuses(state, payload) {
      state.docsRegistryStatuses = payload
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
    salaryTariffTypes: ({ salaryTariffTypes }) => salaryTariffTypes,
    salaryTariffTypesMap: ({ salaryTariffTypes }) =>
      new Map(salaryTariffTypes.map((i) => [i.value, i.text])),
    docsRegistryStatuses: ({ docsRegistryStatuses }) => docsRegistryStatuses,
    docsRegistryStatusesMap: ({ docsRegistryStatuses }) =>
      new Map(docsRegistryStatuses.map((i) => [i.value, i.text])),
  },
}
