import service from '@/modules/profile/services/downtime.service'

export default {
  state: {
    downtimes: [],
    downtimeTypes: [
      { text: 'Ремонт', value: 'repair' },
      { text: 'Выходной у водителя', value: 'holiday' },
    ],
  },
  mutations: {
    clearDirectories(state) {
      state.downtimes = []
    },
    setDowntimes(state, payload) {
      state.downtimes = payload
    },
    addDowntimes(state, payload) {
      if (
        state.downtimes.findIndex((item) => item._id === payload._id) === -1
      ) {
        state.downtimes.push(payload)
      }
    },
    updateDowntime(state, payload) {
      const ind = state.downtimes.findIndex((item) => item._id === payload._id)
      if (ind !== -1) state.downtimes.splice(ind, 1, payload)
    },
    deleteDowntime(state, id) {
      state.downtimes = state.downtimes.filter((item) => item._id !== id)
    },
  },
  actions: {
    async getDowntimes({ commit, getters }, directiveUpdate) {
      try {
        commit('setLoading', true)
        if (
          directiveUpdate ||
          (getters.downtimes.length === 0 && getters.directoriesProfile)
        ) {
          commit('setDowntimes', [])
          const data = await service.getByDerictoriesProfile(
            getters.directoriesProfile
          )
          commit('setDowntimes', data)
        }
        commit('setLoading', false)
      } catch (e) {
        commit('setLoading', false)
        commit('setError', e.response?.data?.message)
      }
    },
  },
  getters: {
    downtimesMap: ({ downtimes }) =>
      new Map(downtimes.map((item) => [item._id, item])),
    downtimes: ({ downtimes }) => downtimes,
    downtimeTypes: ({ downtimeTypes }) => downtimeTypes,
  },
}
