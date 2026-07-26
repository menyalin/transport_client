import api from '@/api'

const BASE_PATH = '/tariff_contracts'

class TariffContractService {
  async create(body: Record<string, any>): Promise<any> {
    const { data } = await api.post(BASE_PATH, body)
    return data
  }

  async updateOne(id: string | number, body: Record<string, any>): Promise<any> {
    const { data } = await api.put(BASE_PATH + '/' + id, body)
    return data
  }

  async getList(params?: Record<string, any>): Promise<any> {
    const { data } = await api.get(BASE_PATH, { params })
    return data
  }

  async getById(id: string | number): Promise<any> {
    const { data } = await api.get(BASE_PATH + '/' + id)
    return data
  }

  async deleteById(id: string | number): Promise<any> {
    const data = await api.delete(BASE_PATH + '/' + id)
    return data
  }
}

export default new TariffContractService()
