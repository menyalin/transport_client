import api from '@/api'
import socket from '@/socket'
import store from '@/store'
const BASE_PATH = '/schedule_notes'

class ScheduleNoteService {
  constructor() {
    socket.on('scheduleNote:created', (data) => {
      store.commit('addScheduleNote', data)
      store.commit('addToCache', data)
    })

    socket.on('notesForSchedule', (data) => {
      store.commit('setScheduleNotes', data)
    })

    socket.on('scheduleNote:updated', (data) => {
      store.commit('updateScheduleNote', data)
      store.commit('addToCache', data)
    })
    socket.on('scheduleNote:deleted', (id) => {
      store.commit('deleteScheduleNote', id)
      store.commit('deleteFromCache', id)
    })
  }

  async create(body) {
    let { data } = await api.post(BASE_PATH, body)
    store.commit('addToCache', data)
    return data
  }

  async updateOne(id, body) {
    let { data } = await api.put(BASE_PATH + '/' + id, body)
    store.commit('addToCache', data)
    return data
  }

  async getList(params) {
    let { data } = await api.get(BASE_PATH, { params })
    return data
  }

  async getListForSchedule(params) {
    socket.emit('notesForSchedule', params)
  }

  async getById(id) {
    if (store.getters.cacheDirectories.has(id))
      return store.getters.cacheDirectories.get(id)
    else {
      let { data } = await api.get(BASE_PATH + '/' + id)
      store.commit('addToCache', data)
      return data
    }
  }

  async deleteById(id) {
    let data = await api.delete(BASE_PATH + '/' + id)
    return data
  }
}

export default new ScheduleNoteService()
