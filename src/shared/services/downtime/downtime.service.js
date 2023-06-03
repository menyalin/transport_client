import api from '@/api'
import socket from '@/socket'
import store from '@/store'
const BASE_PATH = '/downtimes'

class DowntimeService {
  constructor() {
    socket.on('downtime:created', (data) => {
      store.commit('addDowntime', data)
      store.commit('addToCache', data)
    })

    socket.on('downtimesForSchedule', (data) => {
      store.commit('setDowntimes', data)
    })

    socket.on('downtime:updated', (data) => {
      store.commit('updateDowntime', data)
      store.commit('addToCache', data)
    })
    socket.on('downtime:deleted', (id) => {
      store.commit('deleteDowntime', id)
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
    socket.emit('downtimesForSchedule', params)

    // let { data } = await api.get(BASE_PATH + '/schedule', { params })
    // if (!Array.isArray(data))
    //   throw new Error('Нужен массив!! пришло что-то другое!')
    // return data
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

export default new DowntimeService()
