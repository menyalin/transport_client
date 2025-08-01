import api from '@/api'
import socket from '@/socket'
import store from '@/store'
const BASE_PATH = '/partners'

class PartnerService {
  constructor() {
    socket.on('partner:created', (data) => {
      store.commit('addPartner', data)
      store.commit('addToCache', data)
    })

    socket.on('partner:updated', (data) => {
      store.commit('updatePartner', data)
      store.commit('addToCache', data)
    })
    socket.on('partner:deleted', (id) => {
      store.commit('deletePartner', id)
      store.commit('deleteFromCache', id)
    })
  }

  async create(body) {
    let { data } = await api.post(BASE_PATH, {
      ...body,
      company: store.getters.directoriesProfile,
    })
    store.commit('addToCache', data)
    return data
  }

  async addIdleTruckNotify(partnerId, body) {
    if (!partnerId || !body)
      throw new Error(
        'PartnerService : addIdleTruckNotify : required args is missing'
      )
    const { data } = await api.post(
      BASE_PATH + '/' + partnerId + '/idle_truck_notification',
      body
    )
    return data
  }

  async deleteIdleTruckNotify(partnerId, idleId) {
    if (!partnerId || !idleId)
      throw new Error(
        'PartnerService : deleteIdleTruckNotify : required args is missing'
      )
    const { data } = await api.delete(
      BASE_PATH + '/' + partnerId + '/idle_truck_notification/' + idleId
    )
    return data
  }

  async updateIdleTruckNotify(partnerId, idleId, body) {
    if (!partnerId || !idleId)
      throw new Error(
        'PartnerService : updateIdleTruckNotify : required args is missing'
      )
    const { data } = await api.put(
      BASE_PATH + '/' + partnerId + '/idle_truck_notification/' + idleId,
      body
    )
    return data
  }

  async addPlaceForTransferDocs(partnerId, body) {
    const { data } = await api.post(
      BASE_PATH + '/' + partnerId + '/places',
      body
    )
    return data
  }

  async deletePlaceForTransferDocs(partnerId, placeId) {
    const { data } = await api.delete(
      BASE_PATH + '/' + partnerId + '/places/' + placeId
    )
    return data
  }

  async updatePlaceForTransferDocs(partnerId, placeId, body) {
    const { data } = await api.put(
      BASE_PATH + '/' + partnerId + '/places/' + placeId,
      body
    )
    return data
  }

  async updateOne(id, body) {
    let { data } = await api.put(BASE_PATH + '/' + id, body)
    store.commit('addToCache', data)
    return data
  }

  async getByDirectoriesProfile(profile) {
    let { data } = await api.get(BASE_PATH, { params: { profile } })
    if (!Array.isArray(data))
      throw new Error('Нужен массив!! пришло что-то другое!')
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

export default new PartnerService()
