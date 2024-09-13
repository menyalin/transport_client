//@ts-nocheck
import api from '@/api'

const BASE_PATH = '/docs_registry'

class DocsRegistryService {
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

  async pickOrders(params) {
    const { data } = await api.get(BASE_PATH + '/pick_orders', { params })
    return data
  }

  async addOrdersToRegistry(params) {
    if (!params.orders || params.orders.length === 0)
      throw new Error(
        'DocsRegistryService:addOrdersToRegistry: orders is missing!'
      )

    if (!params.docsRegistryId)
      throw new Error(
        'DocsRegistryService:addOrdersToRegistry: docsRegistryId is missing!'
      )

    const { data } = await api.post(
      BASE_PATH + '/add_orders_to_registry',
      params
    )
    return data
  }

  async removeOrdersFromRegistry(params) {
    if (!params.orders || params.orders.length === 0)
      throw new Error(
        'DocsRegistryService:removeOrdersFromRegistry: orders is missing!'
      )

    if (!params.docsRegistryId)
      throw new Error(
        'DocsRegistryService:removeOrdersFromRegistry: docsRegistryId is missing!'
      )

    const { data } = await api.post(
      BASE_PATH + '/remove_orders_from_registry',
      params
    )
    return data
  }

  async getById(id) {
    const { data } = await api.get(BASE_PATH + '/' + id)
    return data
  }

  async deleteById(id) {
    const data = await api.delete(BASE_PATH + '/' + id)
    return data
  }
}

export default new DocsRegistryService()
