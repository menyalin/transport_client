import api from '@/api'
import socket from '@/socket'
import store from '@/store'
const BASE_PATH = '/trucks'

class TruckService {
  constructor() {
    socket.on('truck:created', data => {
      store.commit('addTruck', data)
      store.commit('addToCache', data)
    })
    socket.on('truck:updated', data => {
      store.commit('updateTruck', data)
      store.commit('addToCache', data)
    })
    socket.on('truck:deleted', id => {
      store.commit('deleteTruck', id)
      store.commit('deleteFromCache', id)
    })
  }

  async create(body) {
    let { data } = await api.post(BASE_PATH, body)
    store.commit('addToCache', data)
    return data
  }

  async updateOne(id, body) {
    try {
      let { data } = await api.put(BASE_PATH + '/' + id, body)
      store.commit('addToCache', data)
      return data
    } catch (e) {
      store.commit('setError', e.response.data)
      return null
    }
  }

  async getByDirectoriesProfile(profile) {
    let { data } = await api.get(BASE_PATH, { params: { profile } })
    if (!Array.isArray(data)) throw new Error('Нужен массив!! пришло что-то другое!')
    return data
  }

  async search(str, type, profile) {
    let params = { querySearch: str }
    if (type) params.type = type
    if (profile) params.profile = profile
    const { data } = await api.get(BASE_PATH + '/search', { params })
    return data
  }

  async getById(id) {
    if (store.getters.cacheDirectories.has(id)) return store.getters.cacheDirectories.get(id)
    else {
      const { data } = await api.get(BASE_PATH + '/' + id)
      store.commit('addToCache', data)
      return data
    }
  }

  async deleteById(id) {
    let data = await api.delete(BASE_PATH + '/' + id)
    store.commit('deleteFromCache', id)
    return data
  }
}

export default new TruckService()
