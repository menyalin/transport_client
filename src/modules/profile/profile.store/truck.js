import TruckService from '@/modules/profile/services/truck.service'

export default {
  state: {
    trucks: [],
    truckTypes: [
      { text: 'Грузовик', value: 'truck' },
      { text: 'Прицеп (П/П)', value: 'trailer' },
    ],
  },
  mutations: {
    clearDirectories(state) {
      state.trucks = []
    },

    setTrucks(state, payload) {
      state.trucks = payload
    },

    addTruck({ trucks }, payload) {
      if (trucks.findIndex((item) => item._id === payload._id) === -1) {
        trucks.push(payload)
      }
    },

    updateTruck({ trucks }, payload) {
      const ind = trucks.findIndex((item) => item._id === payload._id)
      if (ind !== -1) trucks.splice(ind, 1, payload)
    },

    deleteTruck(state, id) {
      state.trucks = state.trucks.filter((item) => item._id !== id)
    },
  },
  actions: {
    truckCreate({ commit }, payload) {
      return new Promise(async (resolve, reject) => {
        try {
          commit('setLoading', true)
          const data = await TruckService.create(payload)
          commit('addTruck', data)
          commit('setLoading', false)
          resolve(data)
        } catch (e) {
          commit('setLoading', false)
          commit('setError', e)
          reject(e)
        }
      })
    },

    async getTrucks({ commit, getters }, directiveUpdate) {
      try {
        commit('setLoading', true)
        if (
          directiveUpdate ||
          (getters.trucks.length === 0 && getters.directoriesProfile)
        ) {
          commit('setTrucks', [])
          const data = await TruckService.getByDerictoriesProfile(
            getters.directoriesProfile
          )
          commit('setTrucks', data)
        }
        commit('setLoading', false)
      } catch (e) {
        commit('setLoading', false)
        commit('setError', e.response?.data?.message)
      }
    },
  },
  getters: {
    trucks: ({ trucks }, { directoriesProfile }) =>
      trucks.filter((item) => item.company === directoriesProfile),

    truckTypes: ({ truckTypes }) => truckTypes,

    truckTypesHash: ({ truckTypes }) =>
      truckTypes.reduce((hash, item) => {
        hash[item.value] = item.text
        return hash
      }, {}),

    allowedToUseTrailersTrucksSet: ({ trucks }) => {
      const filtered = trucks.filter(
        (item) => item.type === 'truck' && item.allowUseTrailer
      )
      let res = new Set()
      filtered.forEach((item) => {
        res.add(item._id)
      })
      return res
    },
    trucksForSelect:
      ({ trucks }) =>
      ({ type, tkName }) => {
        return trucks
          .filter((item) => (tkName ? item.tkName._id === tkName : true))
          .filter((item) => (type ? item.type === type : true))
      },
  },
}
