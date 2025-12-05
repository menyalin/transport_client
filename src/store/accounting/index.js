import TariffContractStore from './tariffContract'

export default {
  state: {
    documentTypes: [],
    documentStatuses: [],
    salaryTariffTypes: [],
    docsRegistryStatuses: [],
    paymentInvoiceStatuses: [],
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
    setPaymentInvoiceStatuses(state, payload) {
      state.paymentInvoiceStatuses = payload
    },
  },
  actions: {},
  getters: {
    documentTypes: ({ documentTypes }) => documentTypes,
    documentTypesMap: ({ documentTypes }) => new Map(documentTypes.map(i => [i.value, i.text])),

    documentStatuses: ({ documentStatuses }) => documentStatuses,
    documentStatusesMap: ({ documentStatuses }) => new Map(documentStatuses.map(i => [i.value, i.text])),

    salaryTariffTypes: ({ salaryTariffTypes }) => salaryTariffTypes,
    salaryTariffTypesMap: ({ salaryTariffTypes }) => new Map(salaryTariffTypes.map(i => [i.value, i.text])),

    docsRegistryStatuses: ({ docsRegistryStatuses }) => docsRegistryStatuses,
    docsRegistryStatusesMap: ({ docsRegistryStatuses }) => new Map(docsRegistryStatuses.map(i => [i.value, i.text])),

    paymentInvoiceStatuses: ({ paymentInvoiceStatuses }) => paymentInvoiceStatuses,
    paymentInvoiceStatusesMap: ({ paymentInvoiceStatuses }) =>
      new Map(paymentInvoiceStatuses.map(i => [i.value, i.text])),
  },
  modules: { TariffContractStore },
}
