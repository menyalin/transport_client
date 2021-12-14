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
        .sort(_sortDriversByFullName)
        .map(_addMedBookState),

    driversMap: ({ drivers }) => {
      let map = new Map()
      drivers.forEach((item) => {
        map.set(item._id, item)
      })
      return map
    },

    brigadiersForSelect: ({ drivers }) =>
      drivers
        .filter((d) => d.isBrigadier)
        .map((d) => ({
          ...d,
          value: d._id,
          text: d.fullName,
        })),
    mechanicsForSelect: ({ drivers }) =>
      drivers
        .filter((d) => d.isMechanic)
        .map((d) => ({
          ...d,
          value: d._id,
          text: d.fullName,
        })),

    driversForSelect:
      ({ drivers }) =>
      (tkName) =>
        drivers

          .filter((item) => (!!tkName ? item.tkName._id === tkName : true))
          .sort(_sortDriversByFullName),
  },
}

const _sortDriversByFullName = (a, b) => {
  if (a.fullName > b.fullName) return 1
  else return -1
}

const _getColor = (days) => {
  if (days === null || days === undefined) return null
  if (days < 14) return 'error'
  if (days < 30) return 'warning'
  return 'light-green'
}

const _addMedBookState = (driver) => {
  const MS_IN_DAY = 1000 * 60 * 60 * 24
  const MS_IN_YEAR = 1000 * 60 * 60 * 24 * 365
  let validDays
  const today = new Date()
  if (
    !driver?.medBook?.certifiedBeforeDate ||
    !driver?.medBook?.annualCommisionDate
  )
    validDays = null
  else {
    const validCertDays = Math.floor(
      (new Date(driver.medBook.certifiedBeforeDate) - today) / MS_IN_DAY
    )

    const daysBeforeMedExamination = Math.floor(
      (+new Date(driver.medBook.annualCommisionDate) + MS_IN_YEAR - today) /
        MS_IN_DAY
    )
    validDays = Math.min(daysBeforeMedExamination, validCertDays)
  }

  return {
    ...driver,
    medBookState: {
      validDays,
      color: _getColor(validDays),
    },
  }
}
