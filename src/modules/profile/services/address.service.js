import api from '@/api'
import socket from '@/socket'
import store from '@/store'
const BASE_PATH = '/addresses'

class AddressService {
  _convertGeoToStr(arr) {
    return arr.reverse().join(', ')
  }

  _prepareData = (data) => {
    if (data?.geo?.coordinates && Array.isArray(data.geo.coordinates))
      data.geo = this._convertGeoToStr(data.geo.coordinates)
    return data
  }

  constructor() {
    socket.on('address:created', (data) => {
      store.commit('addAddress', this._prepareData(data))
    })

    socket.on('address:updated', (data) => {
      store.commit('updateAddress', this._prepareData(data))
    })
    socket.on('address:deleted', (id) => {
      store.commit('deleteAddress', id)
    })
  }

  async getSuggestions(address) {
    const { data } = await api.get(BASE_PATH + '/get_suggestions', {
      params: { address },
    })
    return data
  }

  async search(params) {
    const { data } = await api.get(BASE_PATH + '/search', { params })
    return data
  }

  async create(newAddress) {
    let { data } = await api.post(BASE_PATH, newAddress)
    data = this._prepareData(data)
    return data
  }

  async updateOne(id, body) {
    let { data } = await api.put(BASE_PATH + '/' + id, body)
    data = this._prepareData(data)
    return data
  }

  async getByDirectoriesProfile(profile) {
    let { data } = await api.get(BASE_PATH, { params: { profile } })
    if (!Array.isArray(data))
      throw new Error('Нужен массив!! пришло что-то другое!')
    return data.map((i) => this._prepareData(i))
  }

  async getById(id) {
    let { data } = await api.get(BASE_PATH + '/' + id)
    data = this._prepareData(data)
    return data
  }

  async deleteById(id) {
    let data = await api.delete(BASE_PATH + '/' + id)
    return data
  }
}

export default new AddressService()
