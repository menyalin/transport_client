import api from '@/api'
import socket from '@/socket'
import store from '@/store'
const BASE_PATH = '/tariffs'

class TariffService {
  constructor() {
    this.MODEL_NAME = 'tariff'

    socket.on(this.MODEL_NAME + ':created', (data) => {
      store.commit('addToCache', data)
    })

    socket.on(this.MODEL_NAME + ':updated', (data) => {
      store.commit('addToCache', data)
    })
    socket.on(this.MODEL_NAME + ':deleted', (id) => {
      store.commit('deleteFromCache', id)
    })
  }

  async create(body) {
    let { data } = await api.post(BASE_PATH, body)
    return data
  }

  async updateOne({ _id, body }) {
    let { data } = await api.put(BASE_PATH + '/' + _id, body)
    return data
  }

  async getList(params) {
    let { data } = await api.get(BASE_PATH, { params })
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

  async getOrderPrePrices(params) {
    const { data } = await api.post(BASE_PATH + '/get_order_preprice', params)
    return data
  }

  async deleteById(id) {
    let data = await api.delete(BASE_PATH + '/' + id)
    return data
  }
}

export default new TariffService()
