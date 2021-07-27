import api from '@/api'
import socket from '@/socket'
import store from '@/store'
const BASE_PATH = '/routeSheets'

class RouteSheetService {
  constructor() {
    socket.on('routeSheet:created', (data) => {
      store.commit('addRouteSheet', data)
    })
    socket.on('routeSheet:updated', (data) => {
      store.commit('updateRouteSheet', data)
    })
    socket.on('routeSheet:deleted', (id) => {
      store.commit('deleteRouteSheet', id)
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

export default new RouteSheetService()
