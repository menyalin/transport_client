import api from '@/api'
import socket from '@/socket'
import store from '@/store'
const BASE_PATH = '/zones'

class ZoneService {
  constructor() {
    socket.on('zone:created', data => {
      store.commit('addZone', data)
      store.commit('addToCache', data)
    })

    socket.on('zone:updated', data => {
      store.commit('updateZone', data)
      store.commit('addToCache', data)
    })
    socket.on('zone:deleted', id => {
      store.commit('deleteZone', id)
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

  async getByDirectoriesProfile(profile) {
    let { data } = await api.get(BASE_PATH, { params: { profile } })
    if (!Array.isArray(data)) throw new Error('Нужен массив!! пришло что-то другое!')
    return data
  }

  async getById(id) {
    if (store.getters.cacheDirectories.has(id)) return store.getters.cacheDirectories.get(id)
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

export default new ZoneService()
