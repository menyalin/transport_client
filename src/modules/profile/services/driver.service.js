import api from '@/api'
import socket from '@/socket'
import store from '@/store'
const BASE_PATH = '/drivers'

class DriverService {
  constructor() {
    socket.on('driver:created', (data) => {
      store.commit('addDriver', data)
    })

    socket.on('driver:updated', (data) => {
      store.commit('updateDriver', data)
    })
    socket.on('driver:deleted', (id) => {
      store.commit('deleteDriver', id)
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

  async getById(id) {
    let { data } = await api.get(BASE_PATH + '/' + id)
    return data
  }

  async deleteById(id) {
    let data = await api.delete(BASE_PATH + '/' + id)
    return data
  }
}

export default new DriverService()
