import dayjs from 'dayjs'
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
    addDowntime(state, payload) {
      if (state.downtimes.findIndex((item) => item._id === payload._id) === -1)
        state.downtimes.push(payload)
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
    async getDowntimesForSchedule({ commit, getters }) {
      if (!getters.schedulePeriod) return null
      if (!getters.directoriesProfile) {
        commit('setError', 'Профиль настроек не установлен')
        return null
      }
      service.getListForSchedule({
        company: getters.directoriesProfile,
        startDate: new Date(getters.schedulePeriod[0]).toISOString(),
        endDate: new Date(getters.schedulePeriod[1]).toISOString(),
      })
    },
  },
  getters: {
    downtimesMap: ({ downtimes }) =>
      new Map(downtimes.map((item) => [item._id, item])),
    downtimes: ({ downtimes }) => downtimes,
    downtimeTypes: ({ downtimeTypes }) => downtimeTypes,
    downtimeTypesHash: ({ downtimeTypes }) =>
      downtimeTypes.reduce((hash, item) => {
        hash[item.value] = item.text
        return hash
      }, {}),

    downtimesForSchedule: ({ downtimes }, { schedulePeriod, hiddenTruckIds }) =>
      downtimes.filter((d) => {
        const sP = dayjs(schedulePeriod[0])
        const eP = dayjs(schedulePeriod[1])
        return (
          eP.isAfter(d.startPositionDate) &&
          sP.isSameOrBefore(d.endPositionDate) &&
          !hiddenTruckIds.includes(d.truck)
        )
      }),
  },
}
