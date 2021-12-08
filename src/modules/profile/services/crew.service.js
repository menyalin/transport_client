import api from '@/api'
import socket from '@/socket'
import store from '@/store'

const BASE_PATH = '/crews'

class CrewService {
  constructor() {
    socket.on('crew:created', (data) => {
      store.commit('addCrew', data)
    })
    socket.on('crew:updated', (data) => {
      store.commit('updateCrew', data)
    })
    socket.on('crew:deleted', (id) => {
      store.commit('deleteCrew', id)
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

  async getList(params) {
    let { data } = await api.get(BASE_PATH, { params })
    if (!Array.isArray(data))
      throw new Error('Нужен массив!! пришло что-то другое!')
    return data
  }

  async getActualCrewsOnCurrentDate(params) {
    try {
      const { data } = await api.get(BASE_PATH + '/actual', { params })
      return data
    } catch (e) {
      store.commit('setError', e.message)
    }
  }

  async getActualCrewByDriver(driver) {
    try {
      const params = { driver }
      const { data } = await api.get(BASE_PATH + '/by_driver', { params })
      return data
    } catch (e) {
      store.commit('setError', e.message)
    }
  }
  async getActualCrewByTruck(truck) {
    try {
      const params = { truck }
      const { data } = await api.get(BASE_PATH + '/by_truck', { params })
      return data
    } catch (e) {
      store.commit('setError', e.message)
    }
  }

  async getCrewByTruckAndDate({ truck, date }) {
    const params = { truck, date }
    const { data } = await api.get(BASE_PATH + '/by_truck_and_date', { params })
    return data
  }

  async closeCrew(id, date, type = 'crew') {
    let { data } = await api.put(BASE_PATH + '/close/' + id, {
      endDate: date,
      type,
    })
    return data
  }
  async getById({ id, forEdit }) {
    const params = { forEdit }
    let { data } = await api.get(BASE_PATH + '/' + id, { params })
    return data
  }

  async deleteById(id) {
    let data = await api.delete(BASE_PATH + '/' + id)
    return data
  }

  async diagramReport(params) {
    let { data } = await api.get(BASE_PATH + '/reports/crew_diagram', {
      params,
    })
    return data
  }
}

export default new CrewService()
