import api from '@/api'
import socket from '@/socket'
const BASE_PATH = '/docs_registry'

class DocsRegistryService {
  constructor() {
    socket.on('docsRegistry:created', (_data) => {
      // queryClient.setQueryData([FINES, data._id], data)
      // const fines = queryClient.getQueryData([FINES]) || []
      // queryClient.setQueryData([FINES], [...fines, data])
    })

    socket.on('docsRegistry:updated', (_data) => {
      // queryClient.setQueryData([FINES, data._id], data)
      // const fines = queryClient.getQueryData([FINES])
      // if (fines) queryClient.setQueryData([FINES], [...fines.filter(i => i._id !== data._id), data])
      // else  queryClient.setQueryData([FINES], [data])
    })

    socket.on('docsRegistry:deleted', (_id) => {})
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
    return data
  }

  async pickOrders(params) {
    let { data } = await api.get(BASE_PATH + '/pick_orders', { params })
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
    let { data } = await api.get(BASE_PATH + '/' + id)
    return data
  }

  async deleteById(id) {
    let data = await api.delete(BASE_PATH + '/' + id)
    return data
  }
}

export default new DocsRegistryService()
