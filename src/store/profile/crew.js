import dayjs from 'dayjs'
import { CrewService } from '@/shared/services'

export default {
  state: {
    crews: [],
    tkNameForCrews: null,
  },
  mutations: {
    clearDirectories(state) {
      state.crews = []
      state.activeCrews = []
    },
    setDateForCrews(state, payload) {
      if (payload) state.dateForCrews = dayjs(payload)
      else state.dateForCrews = null
    },
    setTkNameForCrews(state, payload) {
      state.tkNameForCrews = payload
    },
    setCrews(state, payload) {
      state.crews = payload
    },
    addCrew(state, payload) {
      if (state.crews.findIndex(item => item._id === payload._id) === -1) {
        state.crews.push(payload)
      }
    },
    updateCrew(state, payload) {
      const ind = state.crews.findIndex(item => item._id === payload._id)
      if (ind !== -1) state.crews.splice(ind, 1, payload)
    },
    deleteCrew(state, id) {
      state.crews = state.crews.filter(item => item._id !== id)
    },
  },
  actions: {
    createCrew({ commit }, payload) {
      return new Promise((resolve, reject) => {
        commit('setLoading', true)
        CrewService.create(payload)
          .then(data => {
            commit('addCrew', data)
            commit('setLoading', false)
            resolve(data)
          })
          .catch(e => {
            commit('setLoading', false)
            commit('setError', e)
            reject(e)
          })
      })
    },
  },
  getters: {
    tkNameForCrews: ({ tkNameForCrews }) => tkNameForCrews,

    crews: ({ crews, tkNameForCrews }) =>
      crews.filter(item => (tkNameForCrews ? item.tkName._id === tkNameForCrews : true)),
  },
}
