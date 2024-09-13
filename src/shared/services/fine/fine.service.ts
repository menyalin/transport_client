//@ts-nocheck
import api from '@/api'
const BASE_PATH = '/fines'

class FineService {
  constructor() {}

  async create(body) {
    const { data } = await api.post(BASE_PATH, body)
    return data
  }

  async updateOne(id, body) {
    const { data } = await api.put(BASE_PATH + '/' + id, body)
    return data
  }

  async getList(params) {
    const { data } = await api.get(BASE_PATH, { params })
    return data
  }

  async getById(id) {
    const { data } = await api.get(BASE_PATH + '/' + id)
    return data
  }

  async getByNumber(number) {
    const { data } = await api.get(BASE_PATH + '/number/' + number)
    return data
  }

  async deleteById(id) {
    const data = await api.delete(BASE_PATH + '/' + id)
    return data
  }
}

export default new FineService()
