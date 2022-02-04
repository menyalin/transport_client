import api from '@/api'
import socket from '@/socket'
import store from '@/store'
import moment from 'moment'
const BASE_PATH = '/orders'

class OrderService {
  constructor() {
    socket.on('order:created', (data) => {
      store.commit('addOrder', data)
      store.commit('addToCache', data)
    })

    socket.on('ordersForSchedule', (orders) => {
      store.commit('setOrders', orders)
    })

    socket.on('order:updated', (data) => {
      store.commit('updateOrder', data)
      store.commit('addToCache', data)
    })

    socket.on('order:deleted', (id) => {
      store.commit('deleteOrder', id)
      store.commit('deleteFromCache', id)
    })
  }

  moveOrderInSchedule(body) {
    socket.emit('moveOrderInSchedule', body)
  }

  disable(body) {
    socket.emit('disableOrder', body)
  }

  async create(body) {
    let { data } = await api.post(BASE_PATH, body)
    return data
  }

  async createFromTemplate(body) {
    let { data } = await api.post(BASE_PATH + '/from_template', body)
    return data
  }

  async updateOne(id, body) {
    let { data } = await api.put(BASE_PATH + '/' + id, body)
    return data
  }

  async getListForSchedule() {
    socket.emit('ordersForSchedule', {
      profile: store.getters.directoriesProfile,
      startDate: moment(store.getters.schedulePeriod[0]).toISOString(),
      endDate: moment(store.getters.schedulePeriod[1]).toISOString(),
    })

    // let { data } = await api.get(BASE_PATH + '/schedule', { params })
    // if (!Array.isArray(data))
    //   throw new Error('Нужен массив!! пришло что-то другое!')
    // return data
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

  async deleteById(id) {
    let data = await api.delete(BASE_PATH + '/' + id)
    return data
  }

  async getDistance(coords) {
    let { data } = await api.post(BASE_PATH + '/get_distance', { coords })
    return data
  }
}

export default new OrderService()
