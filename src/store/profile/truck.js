import { TruckService } from '@/shared/services'
import dayjs from 'dayjs'

const _trucksSortHandler = (a, b) => {
  if (a.tkName.name > b.tkName.name) return 1
  if (a.tkName.name < b.tkName.name) return -1
  if (a.type > b.type) return -1
  if (a.type < b.type) return 1
  if (a.liftCapacityType > b.liftCapacityType) return -1
  if (a.liftCapacityType < b.liftCapacityType) return 1
  if (a.regNum > b.regNum) return 1
  if (a.regNum < b.regNum) return -1
}

const _getPermanentDriversFromTruck = (truck) => {
  if (!truck.allowedDrivers) return 0
  return truck.allowedDrivers.filter((driver) => driver.isPermanent).length
}

const _getTemporaryDriverFromTruck = (truck) => {
  if (!truck.allowedDrivers) return 0
  return truck.allowedDrivers.filter((driver) => !driver.isPermanent).length
}

const _prepareTruck = (truck) => {
  return {
    ...truck,
    order: truck.order ? +truck.order : 50,
    permanentDriverCount: _getPermanentDriversFromTruck(truck),
    temporaryDriverCount: _getTemporaryDriverFromTruck(truck),
  }
}

export default {
  state: {
    trucks: [],
    allTruckParams: {
      truckTypes: [],
      truckKinds: [],
      loadDirection: [],
      liftCapacityTypes: [],
    },
  },
  mutations: {
    clearDirectories(state) {
      state.trucks = []
    },
    setAllTruckParams(state, payload) {
      state.allTruckParams = Object.assign({}, payload)
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
      return new Promise((resolve, reject) => {
        commit('setLoading', true)
        TruckService.create(payload)
          .then((data) => {
            commit('addTruck', data)
            commit('setLoading', false)
            resolve(data)
          })
          .catch((e) => {
            commit('setLoading', false)
            commit('setError', e)
            reject(e)
          })
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
          const data = await TruckService.getByDirectoriesProfile(
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
      trucks
        .filter((item) => item.company === directoriesProfile)
        .sort(_trucksSortHandler)
        .map(_prepareTruck),

    loadDirection: ({ allTruckParams }, { companySettings }) => {
      return allTruckParams.loadDirection.filter((i) =>
        companySettings.loadDirections.length
          ? companySettings.loadDirections.includes(i.value)
          : true
      )
    },
    allLoadDirection: ({ allTruckParams }) => allTruckParams.loadDirection,

    truckTypes: ({ allTruckParams }) => allTruckParams.truckTypes,

    truckKinds: ({ allTruckParams }, { companySettings }) => {
      return allTruckParams.truckKinds.filter((i) =>
        companySettings.truckKinds.length
          ? companySettings.truckKinds.includes(i.value)
          : true
      )
    },

    allTruckKinds: ({ allTruckParams }) => allTruckParams.truckKinds,

    truckKindsMap: ({ allTruckParams }) =>
      new Map(allTruckParams.truckKinds.map((i) => [i.value, i.text])),

    liftCapacityTypes: ({ allTruckParams }, { companySettings }) => {
      return allTruckParams.liftCapacityTypes.filter((i) =>
        companySettings.liftCapacityTypes.length
          ? companySettings.liftCapacityTypes.includes(i)
          : true
      )
    },

    allLiftCapacityTypes: ({ allTruckParams }) =>
      allTruckParams.liftCapacityTypes,

    truckTypesHash: ({ allTruckParams }) =>
      allTruckParams.truckTypes.reduce((hash, item) => {
        hash[item.value] = item.text
        return hash
      }, {}),

    trucksHash: ({ trucks }) =>
      trucks.reduce((hash, item) => {
        hash[item._id] = item
        return hash
      }, {}),

    allowedToUseTrailersTrucksSet: ({ trucks }) => {
      const filtered = trucks.filter(
        (item) => item.type === 'truck' && item.liftCapacityType === 20
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

    outsourceTruckIds: ({ trucks }) =>
      trucks.filter((t) => t.tkName.outsource).map((t) => t._id),

    trucksMap: ({ trucks }) => {
      let map = new Map()
      trucks.forEach((item) => {
        map.set(item._id, item)
      })
      return map
    },

    activeTrucksOnDate:
      ({ trucks }) =>
      (date) => {
        if (!date || !dayjs(date).isValid) return trucks
        return trucks.filter((item) => {
          const startPeriodCond =
            !item.startServiceDate ||
            new Date(item.startServiceDate) <= new Date(date)
          const endPeriodCond =
            !item.endServiceDate ||
            new Date(item.endServiceDate) > new Date(date)
          return startPeriodCond && endPeriodCond
        })
      },

    hiddenTruckIds: ({ trucks }) => {
      return trucks.filter((t) => t.endServiceDate).map((t) => t._id)
    },

    truckById:
      ({ trucks }) =>
      (id) =>
        trucks.find((truck) => truck._id === id),
  },
}
