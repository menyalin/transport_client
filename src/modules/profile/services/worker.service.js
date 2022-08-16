import api from '@/api'
import socket from '@/socket'
import queryClient from '@/queryClient'
import { WORKERS } from '@/constants/queryKeys'
import store from '@/store'

const BASE_PATH = '/workers'
 

class WorkerService {
  constructor() {

    socket.on('worker:created', (data) => {
      queryClient.setQueryData([WORKERS, data._id], data)
      const workers = queryClient.getQueryData([WORKERS])
      queryClient.setQueryData([WORKERS], [...workers, data])
    })

    socket.on('worker:updated', (data) => {
      queryClient.setQueryData([WORKERS, data._id], data)
      const workers = queryClient.getQueryData([WORKERS])
      if (workers) queryClient.setQueryData([WORKERS], [...workers.filter(i => i._id !== data._id), data])
      else  queryClient.setQueryData([WORKERS], [data])
    })

    socket.on('worker:deleted', (id) => {
      const workers = queryClient.getQueryData([WORKERS])
      if (workers) queryClient.setQueryData([WORKERS], [...workers.filter(i => i._id !== id)])
    })

    socket.on('worker:inviteGetted', (data) => {
      store.commit('addCompanyInvite', data)
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

  async getByDirectoriesProfile() {
    let { data } = await api.get(BASE_PATH, { params: { profile: store.getters.directoriesProfile } })
    if (!Array.isArray(data))
      throw new Error('Нужен массив!! пришло что-то другое!')
    return data
  }

  async getById(id) {
    let { data } = await api.get(BASE_PATH + '/' + id)
    return data
  }

  async getUserByEmail(email) {
    const { data } = await api.get(BASE_PATH + '/user_by_email', {
      params: { email },
    })
    return data
  }

  async sendInvite({workerId, userId, roles}) {
    const { data } = await api.put(BASE_PATH + `/${workerId}/addUser`, {user: userId, roles})
    return data
  }

  async deleteById(id) {
    let data = await api.delete(BASE_PATH + '/' + id)
    return data
  }
}

export default new WorkerService()
