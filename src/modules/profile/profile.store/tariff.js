export default {
  state: {
    tariffTypes: [],
    roundingWaitingByHours: [],
    tariffByItems: [
      { value: 'hour', text: 'Час' },
      { value: 'day', text: 'День' },
    ],
  },
  mutations: {
    setTariffTypes(state, payload) {
      state.tariffTypes = payload
    },
    setRoundingWaitingByHours(state, payload) {
      state.roundingWaitingByHours = payload
    },
  },
  actions: {},
  getters: {
    tariffTypes: ({ tariffTypes }) => tariffTypes,
    tariffTypesMap: ({ tariffTypes }) =>
      new Map(tariffTypes.map((i) => [i.value, i.text])),

    roundingWaitingByHours: ({ roundingWaitingByHours }) =>
      roundingWaitingByHours,
    roundingWaitingByHoursMap: ({ roundingWaitingByHours }) =>
      new Map(roundingWaitingByHours.map((i) => [i.value, i.text])),

    waitingTariffByItems: ({ tariffByItems }) => tariffByItems,
    waitingTariffByItemsMap: ({ tariffByItems }) =>
      new Map(tariffByItems.map((i) => [i.value, i.text])),
  },
}
