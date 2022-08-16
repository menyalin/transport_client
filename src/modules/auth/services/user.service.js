import api from '@/api'
import store from '@/store'
import socket from '@/socket'
import router from '@/router'
const BASE_PATH = '/auth'

class UserService {
  constructor() {
    socket.on('user:changeDirectoriesProfile', () => {
       socket.disconnect()
       socket.connect()
    })

    socket.on('user:clearDirectoriesProfile', () => {
      store.commit('setError', 'Доступ к данным компании заблокирован!')
      store.commit('clearDirectories')
      store.commit('clearDirectoriesProfile')
      router.push('/')
    })
  }

  async configProfile(payload) {
    await api.post(BASE_PATH + '/configProfile', payload)
    return true
  }
  async getById(id) {
    const { data } = await api.get(BASE_PATH + `/${id}`)
    return data
  } 
}

export default new UserService()
