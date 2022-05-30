import api from '@/api'
import { EventObserver } from '@/modules/common/helpers/EventObserver.class'
import socket from '@/socket'
import store from '@/store'
const BASE_PATH = '/agreements'

class AgreementService {
  MODEL_NAME = 'agreement'
  allAgreements = []
  allAgreementsExpiresMs = 1000 * 60 * 5 // 5 минут
  constructor() {
    this.eo = new EventObserver()
    socket.on(this.MODEL_NAME + ':created', (data) => {
      store.commit('addAgreement', data)
      store.commit('addToCache', data)
    })

    socket.on(this.MODEL_NAME + ':updated', (data) => {
      store.commit('updateAgreement', data)
      store.commit('addToCache', data)
    })
    socket.on(this.MODEL_NAME + ':deleted', (id) => {
      store.commit('deleteAgreement', id)
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

  async getList(params) {
    let { data } = await api.get(BASE_PATH, { params })
    return data
  }

  async getForOrder(params) {
    let { data } = await api.get(BASE_PATH + '/get_for_order', { params })
    return data
  }

  async getActiveAgreements() {
    if (this.allAgreements?.length) {
      return this.allAgreements
    } else {
      let { data } = await api.get(BASE_PATH, {
        params: {
          company: store.getters.directoriesProfile,
          limit: 1000,
          skip: 0,
        },
      })
      this.allAgreements = data.items || []
      setTimeout(() => {
        this.allAgreements = []
      }, this.allAgreementsExpiresMs)
      return data.items
    }
  }

  async getById(id) {
    if (store.getters.cacheDirectories.has(id))
      return store.getters.cacheDirectories.get(id)
    else if (this.eo.pending(id)) {
      const promise = new Promise((resolve) => {
        this.eo.subscribe(id, (data) => {
          resolve(data)
        })
      })
      return await promise
    } else {
      this.eo.add(id)
      let { data } = await api.get(BASE_PATH + '/' + id)
      this.eo.broadcast(id, data)
      store.commit('addToCache', data)
      return data
    }
  }

  async deleteById(id) {
    let data = await api.delete(BASE_PATH + '/' + id)
    return data
  }
}

export default new AgreementService()
