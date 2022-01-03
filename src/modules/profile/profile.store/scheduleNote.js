import moment from 'moment'
import service from '@/modules/profile/services/scheduleNote.service'

export default {
  state: {
    notes: [],
  },
  mutations: {
    clearDirectories(state) {
      state.notes = []
    },
    setScheduleNotes(state, payload) {
      state.notes = payload
    },
    addScheduleNote(state, payload) {
      if (state.notes.findIndex((item) => item._id === payload._id) === -1)
        state.notes.push(payload)
    },
    updateScheduleNote(state, payload) {
      const ind = state.notes.findIndex((item) => item._id === payload._id)
      if (ind !== -1) state.notes.splice(ind, 1, payload)
    },
    deleteScheduleNote(state, id) {
      state.notes = state.notes.filter((item) => item._id !== id)
    },
  },
  actions: {
    async getNotesForSchedule({ commit, getters }) {
      if (!getters.schedulePeriod) return null
      if (!getters.directoriesProfile) {
        commit('setError', 'Профиль настроек не установлен')
        return null
      }
      service.getListForSchedule({
        company: getters.directoriesProfile,
        startDate: moment(getters.schedulePeriod[0]).toISOString(),
        endDate: moment(getters.schedulePeriod[1]).toISOString(),
      })
    },
  },
  getters: {
    scheduleNotesMap: ({ notes }) =>
      new Map(notes.map((item) => [item._id, item])),

    scheduleNotes: ({ notes }) => notes,

    notesForSchedule: ({ notes }, { schedulePeriod }) => {
      if (!schedulePeriod) return []
      return notes.filter((n) => {
        const sP = moment(schedulePeriod[0])
        const eP = moment(schedulePeriod[1])
        return (
          eP.isAfter(n.startPositionDate) &&
          sP.isSameOrBefore(n.startPositionDate)
        )
      })
    },
  },
}
