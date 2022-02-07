export default {
  state: {
    agreements: [],
    vatRates: [
      { text: 'Без НДС', value: 0 },
      { text: '20%', value: 20 },
    ],
    calcMethods: [],
  },
  mutations: {
    clearDirectories(state) {
      state.agreements = []
      state.calcMethods = []
    },
    setAgreements(state, payload) {
      state.agreements = payload
    },
    setCalcMethods(state, payload) {
      state.calcMethods = payload
    },
    addAgreement(state, payload) {
      if (state.agreements.findIndex((item) => item._id === payload._id) === -1)
        state.agreements.push(payload)
    },
    updateAgreement(state, payload) {
      const ind = state.agreements.findIndex((item) => item._id === payload._id)
      if (ind !== -1) state.agreements.splice(ind, 1, payload)
    },
    deleteAgreement(state, id) {
      state.agreements = state.agreements.filter((item) => item._id !== id)
    },
  },
  actions: {},
  getters: {
    agreements: ({ agreements }) => agreements,
    agreementsMap: ({ agreements }) =>
      new Map(agreements.map((i) => [i._id, i])),
    vatRates: ({ vatRates }) => vatRates,
    calcMethods: ({ calcMethods }) => calcMethods,
  },
}
