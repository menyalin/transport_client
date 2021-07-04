import api from '@/api'
const BASE_PATH = '/addresses'

class AddressService {
  _convertGeoToStr(arr) {
    return arr.reverse().join(', ')
  }

  async getSuggestions(address) {
    const { data } = await api.get(BASE_PATH + '/get_suggestions', {
      params: { address },
    })
    return data
  }

  async create(newAddress) {
    const { data } = await api.post(BASE_PATH, newAddress)
    if (data?.geo?.coordinates && Array.isArray(data.geo.coordinates))
      data.geo = this._convertGeoToStr(data.geo.coordinates)
    return data
  }

  async getByDerictoriesProfile(profile) {
    const { data } = await api.get(BASE_PATH, { params: { profile } })
    if (!Array.isArray(data))
      throw new Error('Нужен массив!! пришло что-то другое!')
    data.forEach((item) => {
      item.geo = this._convertGeoToStr(item.geo.coordinates)
    })
    return data
  }
}

export default new AddressService()
