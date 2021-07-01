import api from '@/api'
import store from '@/store'
import socket from '@/socket'
const BASE_PATH = '/auth'

class UserService {
  async configProfile(payload) {
    await api.post(BASE_PATH + '/configProfile', payload)
    return true
  }
}

export default new UserService()
