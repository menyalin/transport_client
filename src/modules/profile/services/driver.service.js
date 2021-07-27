import api from '@/api'
import socket from '@/socket'
import store from '@/store'
const BASE_PATH = '/drivers'

class DriverService {
  constructor() {
    socket.on('driver:created', (data) => {
      store.commit('addDriver', data)
      store.commit('addToCache', data)
    })

    socket.on('driver:updated', (data) => {
      store.commit('updateDriver', data)
      store.commit('addToCache', data)
    })
    socket.on('driver:deleted', (id) => {
      store.commit('deleteDriver', id)
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

  async getByDerictoriesProfile(profile) {
    let { data } = await api.get(BASE_PATH, { params: { profile } })
    if (!Array.isArray(data))
      throw new Error('Нужен массив!! пришло что-то другое!')
    return data
  }

  async search(str, profile) {
    let params = { querySearch: str }
    if (profile) params.profile = profile
    const { data } = await api.get(BASE_PATH + '/search', { params })
    store.commit('addArrayToCache', data)
    return data
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

export default new DriverService()
