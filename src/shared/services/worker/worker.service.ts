//@ts-nocheck
import api from '@/api'
import socket from '@/socket'
import store from '@/store'

const BASE_PATH = '/workers'

class WorkerService {
  constructor() {
    socket.on('worker:inviteGetted', (data) => {
      store.commit('addCompanyInvite', data)
    })
  }

  async create(body) {
    const { data } = await api.post(BASE_PATH, body)
    return data
  }

  async updateOne(id, body) {
    const { data } = await api.put(BASE_PATH + '/' + id, body)
    return data
  }

  async getByDirectoriesProfile() {
    const { data } = await api.get(BASE_PATH, {
      params: { profile: store.getters.directoriesProfile },
    })
    if (!Array.isArray(data))
      throw new Error('Нужен массив!! пришло что-то другое!')
    return data
  }

  async getForAutocomplete(params) {
    const { data } = await api.get(BASE_PATH + '/get_for_autocomplete', {
      params: params,
    })
    return data
  }

  async getById(id) {
    const { data } = await api.get(BASE_PATH + '/' + id)
    return data
  }

  async getUserByEmail(email) {
    const { data } = await api.get(BASE_PATH + '/user_by_email', {
      params: { email },
    })
    return data
  }

  async sendInvite({ workerId, userId, roles }) {
    const { data } = await api.put(BASE_PATH + `/${workerId}/addUser`, {
      user: userId,
      roles,
    })
    return data
  }

  async acceptInvite({ workerId, accepted }) {
    const { data } = await api.put(BASE_PATH + `/${workerId}/acceptInvite`, {
      accepted,
    })
    return data
  }

  async deleteById(id) {
    const data = await api.delete(BASE_PATH + '/' + id)
    return data
  }
}

export default new WorkerService()
