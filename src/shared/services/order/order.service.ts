import dayjs from 'dayjs'
import { v4 as uuidv4 } from 'uuid'

import api from '@/api'
import getMaxDistance from '@/modules/common/helpers/getMaxDistance'
import socket from '@/socket'
import store from '@/store'

const BASE_PATH = '/orders'

class OrderService {
  constructor() {
    socket.on('order:created', (data) => {
      store.commit('addOrder', data)
      store.commit('addToCache', data)
    })

    socket.on('ordersForSchedule', (orders) => {
      store.commit('addOrdersToSchedule', orders)
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
    const { data } = await api.post(BASE_PATH, body, {
      headers: { 'request-id': uuidv4() },
    })
    return data
  }

  async createFromTemplate(body) {
    const { data } = await api.post(BASE_PATH + '/from_template', body)
    return data
  }

  async updateOne(id, body) {
    const { data } = await api.put(BASE_PATH + '/' + id, body)
    return data
  }

  async updateFinalPrices(body) {
    const { data } = await api.post(BASE_PATH + '/save_final_prices', body)
    return data
  }

  async getListForSchedule(startDate, endDate) {
    if (!startDate && !store.getters.schedulePeriod) return null
    socket.emit('ordersForSchedule', {
      profile: store.getters.directoriesProfile,
      startDate: dayjs(startDate || store.getters.schedulePeriod[0])
        .add(-1, 'd')
        .toISOString(),
      endDate: dayjs(endDate || store.getters.schedulePeriod[1])
        .endOf('day')
        .toISOString(),
    })
  }

  async getList(params) {
    const { data } = await api.get(BASE_PATH, { params })
    return data
  }

  async getById(id) {
    if (store.getters.cacheDirectories.has(id))
      return store.getters.cacheDirectories.get(id)
    else {
      try {
        const { data } = await api.get(BASE_PATH + '/' + id)
        store.commit('addToCache', data)
        return data
      } catch (e) {
        store.commit('setError', e.message)
      }
    }
  }

  async deleteById(id) {
    const data = await api.delete(BASE_PATH + '/' + id)
    return data
  }

  async getDistance(coords) {
    const { data } = await api.post(BASE_PATH + '/get_distance', { coords })
    return data
  }
  getDirectDistance(coords) {
    return getMaxDistance(coords)
  }

  async setDocs(orderId, docs) {
    const { data } = await api.put(`${BASE_PATH}/${orderId}/setDocs`, { docs })
    return data
  }

  async setDocState(orderId, state) {
    const { data } = await api.put(`${BASE_PATH}/${orderId}/setDocsState`, {
      state,
    })
    return data
  }

  async autoFillOrderDates(params) {
    const { data } = await api.post(`${BASE_PATH}/auto_set_route_dates`, params)
    return data
  }
}

export default new OrderService()
