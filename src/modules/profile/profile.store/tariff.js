export default {
  state: {
    tariffTypes: [],
  },
  mutations: {
    setTariffTypes(state, payload) {
      state.tariffTypes = payload
    },
  },
  actions: {},
  getters: {
    tariffTypes: ({ tariffTypes }) => tariffTypes,
    tariffTypesMap: ({ tariffTypes }) =>
      new Map(tariffTypes.map((i) => [i.value, i.text])),
  },
}
