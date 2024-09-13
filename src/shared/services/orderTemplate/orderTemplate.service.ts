import api from '@/api'
import socket from '@/socket'
import store from '@/store'
const BASE_PATH = '/order_templates'

class OrderTemplateService {
  constructor() {
    socket.on('orderTemplate:created', (data) => {
      store.commit('addOrderTemplate', data)
      store.commit('addToCache', data)
    })

    socket.on('orderTemplate:updated', (data) => {
      store.commit('updateOrderTemplate', data)
      store.commit('addToCache', data)
    })
    socket.on('orderTemplate:deleted', (id) => {
      store.commit('deleteOrderTemplate', id)
      store.commit('deleteFromCache', id)
    })
  }

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

  async getList(params) {
    const { data } = await api.get(BASE_PATH, { params })
    return data
  }

  async getById(id) {
    if (store.getters.cacheDirectories.has(id))
      return store.getters.cacheDirectories.get(id)
    else {
      const { data } = await api.get(BASE_PATH + '/' + id)
      store.commit('addToCache', data)
      return data
    }
  }

  async deleteById(id) {
    const data = await api.delete(BASE_PATH + '/' + id)
    return data
  }
}

export default new OrderTemplateService()
