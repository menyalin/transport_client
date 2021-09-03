import DriverService from '@/modules/profile/services/driver.service'

export default {
  state: {
    drivers: [],
  },
  mutations: {
    setDrivers(state, payload) {
      state.drivers = payload
    },
    addDriver({ drivers }, payload) {
      if (drivers.findIndex((item) => item._id === payload._id) === -1) {
        drivers.push(payload)
      }
    },
    updateDriver({ drivers }, payload) {
      const ind = drivers.findIndex((item) => item._id === payload._id)
      if (ind !== -1) drivers.splice(ind, 1, payload)
    },
    deleteDriver(state, id) {
      state.drivers = state.drivers.filter((item) => item._id !== id)
    },
  },
  actions: {
    driverCreate({ commit }, payload) {
      return new Promise(async (resolve, reject) => {
        try {
          commit('setLoading', true)
          const data = await DriverService.create(payload)
          commit('addDriver', data)
          commit('setLoading', false)
          resolve(data)
        } catch (e) {
          commit('setLoading', false)
          commit('setError', e)
          reject(e)
        }
      })
    },

    async getDrivers({ commit, getters }, directiveUpdate) {
      try {
        commit('setLoading', true)
        if (
          directiveUpdate ||
          (getters.drivers.length === 0 && getters.directoriesProfile)
        ) {
          const profile = getters.directoriesProfile
          const date = moment().format()
          commit('setDrivers', [])
          const drivers = await DriverService.getByDerictoriesProfile(profile)
          const actualCrews = await CrewService.getActualCrews(profile, date)
          commit('setActualCrews', actualCrews)
          commit('setDrivers', drivers)
        }
        commit('setLoading', false)
      } catch (e) {
        commit('setLoading', false)
        commit('setError', e.response?.data?.message)
      }
    },
  },
  getters: {
    drivers: ({ drivers }, { directoriesProfile }) =>
      drivers
        .filter((item) => item.company === directoriesProfile)
        .sort(_sortDriversByFullName),

    driversMap: ({ drivers }) => {
      let map = new Map()
      drivers.forEach((item) => {
        map.set(item._id, item)
      })
      return map
    },

    driversForSelect:
      ({ drivers }) =>
      (tkName) =>
        drivers
          .filter((item) => item.tkName._id === tkName)
          .sort(_sortDriversByFullName),
  },
}

const _sortDriversByFullName = (a, b) => {
  if (a.fullName > b.fullName) return 1
  else return -1
}
