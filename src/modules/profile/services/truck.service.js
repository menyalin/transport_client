import api from '@/api'
import socket from '@/socket'
import store from '@/store'
const BASE_PATH = '/trucks'

class TruckService {
  constructor() {
    socket.on('truck:created', (data) => {
      store.commit('addTruck', data)
    })
    socket.on('truck:updated', (data) => {
      store.commit('updateTruck', data)
    })
    socket.on('truck:deleted', (id) => {
      store.commit('deleteTruck', id)
    })
  }

  async create(body) {
    let { data } = await api.post(BASE_PATH, body)
    return data
  }

  async updateOne(id, body) {
    let { data } = await api.put(BASE_PATH + '/' + id, body)
    return data
  }

  async getByDerictoriesProfile(profile) {
    let { data } = await api.get(BASE_PATH, { params: { profile } })
    if (!Array.isArray(data))
      throw new Error('Нужен массив!! пришло что-то другое!')
    return data
  }

  async search(str, type, profile) {
    let params = { querySearch: str }
    if (type) params.type = type
    if (profile) params.profile = profile
    const { data } = await api.get(BASE_PATH + '/search', { params })

    if (type === 'truck')
      data.forEach((item) => {
        store.commit('addAllowUseTrailer', item)
      })
    return data
  }

  async getById(id) {
    let { data } = await api.get(BASE_PATH + '/' + id)
    if (data.type === 'truck') store.commit('addAllowUseTrailer', data)
    return data
  }

  async deleteById(id) {
    let data = await api.delete(BASE_PATH + '/' + id)
    return data
  }
}

export default new TruckService()
