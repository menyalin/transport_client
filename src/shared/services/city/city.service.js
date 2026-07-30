import api from '@/api'
import store from '@/store'
const BASE_PATH = '/cities'

class CityService {
  async create(body) {
    const { data } = await api.post(BASE_PATH, body)
    store.commit('addToCache', data)
    return data
  }

  async updateOne(id, body) {
    const { data } = await api.put(BASE_PATH + '/' + id, body)
    store.commit('addToCache', data)
    return data
  }

  async getByDirectoriesProfile(profile) {
    const { data } = await api.get(BASE_PATH, { params: { profile } })
    if (!Array.isArray(data)) throw new Error('Нужен массив!! пришло что-то другое!')
    return data
  }

  async getById(id) {
    if (store.getters.cacheDirectories.has(id)) return store.getters.cacheDirectories.get(id)
    const { data } = await api.get(BASE_PATH + '/' + id)
    store.commit('addToCache', data)
    return data
  }

  async deleteById(id) {
    const data = await api.delete(BASE_PATH + '/' + id)
    return data
  }
}

export default new CityService()
