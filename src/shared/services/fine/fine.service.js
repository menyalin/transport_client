import api from '@/api'
import socket from '@/socket'
const BASE_PATH = '/fines'

class FineService {
  constructor() {
    socket.on('fine:created', (_data) => {
      // queryClient.setQueryData([FINES, data._id], data)
      // const fines = queryClient.getQueryData([FINES]) || []
      // queryClient.setQueryData([FINES], [...fines, data])
    })

    socket.on('fine:updated', (_data) => {
      // queryClient.setQueryData([FINES, data._id], data)
      // const fines = queryClient.getQueryData([FINES])
      // if (fines) queryClient.setQueryData([FINES], [...fines.filter(i => i._id !== data._id), data])
      // else  queryClient.setQueryData([FINES], [data])
    })

    socket.on('fine:deleted', (_id) => {
      // const fines = queryClient.getQueryData([FINES])
      // if (fines) queryClient.setQueryData([FINES], [...fines.filter(i => i._id !== id)])
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
    return data
  }

  async getById(id) {
    let { data } = await api.get(BASE_PATH + '/' + id)
    return data
  }

  async getByNumber(number) {
    let { data } = await api.get(BASE_PATH + '/number/' + number)
    return data
  }

  async deleteById(id) {
    let data = await api.delete(BASE_PATH + '/' + id)
    return data
  }
}

export default new FineService()
