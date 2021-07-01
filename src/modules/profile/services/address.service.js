import api from '@/api'
const BASE_PATH = '/addresses'
class AddressService {
  async getSuggestions(address) {
    const { data } = await api.get(BASE_PATH + '/get_suggestions', {
      params: { address },
    })
    return data
  }
}

export default new AddressService()
