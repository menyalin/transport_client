import moment from 'moment'
import service from '@/modules/profile/services/crew.service'

const NEAR_DAYS_COUNT = 1

export default {
  state: {
    crews: [],
    dateForCrews: moment(),
    tkNameForCrews: null,
  },
  mutations: {
    clearDirectories(state) {
      state.crews = []
    },
    setDateForCrews(state, payload) {
      if (payload) state.dateForCrews = moment(payload)
      else state.dateForCrews = null
    },
    setTkNameForCrews(state, payload) {
      state.tkNameForCrews = payload
    },
    setCrews(state, payload) {
      state.crews = payload
    },
    addCrew(state, payload) {
      if (state.crews.findIndex((item) => item._id === payload._id) === -1) {
        state.crews.push(payload)
      }
    },
    updateCrew(state, payload) {
      const ind = state.crews.findIndex((item) => item._id === payload._id)
      if (ind !== -1) state.crews.splice(ind, 1, payload)
    },
    deleteCrew(state, id) {
      state.crews = state.crews.filter((item) => item._id !== id)
    },
  },
  actions: {
    createCrew({ commit }, payload) {
      return new Promise(async (resolve, reject) => {
        try {
          commit('setLoading', true)
          const data = await service.create(payload)
          commit('addCrew', data)
          commit('setLoading', false)
          resolve(data)
        } catch (e) {
          commit('setLoading', false)
          commit('setError', e)
          reject(e)
        }
      })
    },

    async getCrews({ commit, getters }, { directiveUpdate, date }) {
      try {
        commit('setLoading', true)
        if (
          directiveUpdate ||
          (getters.crews.length === 0 && getters.directoriesProfile)
        ) {
          commit('setCrews', [])
          const data = await service.getByDerictoriesProfile(
            getters.directoriesProfile,
            date
          )
          commit('setCrews', data)
        }
        commit('setLoading', false)
      } catch (e) {
        commit('setLoading', false)
        commit('setError', e.response?.data?.message)
      }
    },
  },
  getters: {
    tkNameForCrews: ({ tkNameForCrews }) => tkNameForCrews,
    dateForCrews: ({ dateForCrews }) => dateForCrews,
    crews: ({ crews }) => crews,
    crewsByTruck: ({ crews, dateForCrews, tkNameForCrews }, { trucks }) => {
      const res = trucks
        .slice()
        .filter((item) =>
          tkNameForCrews ? item.tkName._id === tkNameForCrews : true
        )
        .filter(_trucksFilter)
        .sort(_sortTruckByOrder)
      const sortedCrews = crews.slice().sort(_sortCrewByStartDate)
      for (let i = 0; i < res.length; i++) {
        if (dateForCrews)
          res[i].actualCrew = sortedCrews.filter((crew) =>
            _actualCrewsForTruckFilter({
              crew,
              truckId: res[i]._id,
              date: dateForCrews,
            })
          )[0]
        else res[i].actualCrew = null

        res[i].nearCrews = sortedCrews
          .filter((crew) =>
            _nearCrewsForTruckFilter({
              crew,
              truckId: res[i]._id,
              date: dateForCrews,
              actualCrew: res[i].actualCrew,
            })
          )
          .reverse()
      }
      return res
    },
  },
}

const _trucksFilter = (item) => item.type === 'truck'

const _sortTruckByOrder = (a, b) => {
  if (a.order < b.order) return -1
  else return 1
}

const _actualCrewsForTruckFilter = ({ crew, truckId, date }) => {
  const isThisTruck = crew.truck?._id === truckId
  const crewStartDateLessThanCurrentDate = moment(
    crew.startDate
  ).isSameOrBefore(date)
  return isThisTruck && crewStartDateLessThanCurrentDate
}

const _nearCrewsForTruckFilter = ({ crew, truckId, date, actualCrew }) => {
  if (actualCrew && actualCrew._id === crew._id) return false

  const isThisTruck = crew.truck?._id === truckId
  if (!date) return isThisTruck

  const startDateRange = date.clone().add(-1 * NEAR_DAYS_COUNT, 'd')
  const endDateRange = date.clone().add(NEAR_DAYS_COUNT, 'd')
  const crewInNearDateRange = moment(crew.startDate).isBetween(
    startDateRange,
    endDateRange,
    'day',
    '[]'
  )
  return isThisTruck && crewInNearDateRange
}

const _sortCrewByStartDate = (a, b) => {
  if (new Date(a.startDate) > new Date(b.startDate)) return -1
  else return 1
}
