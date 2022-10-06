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

    socket.on('user:clearDirectoriesProfile', (companyId) => {
      store.commit('deleteCompany', companyId)
      if (store.getters.directoriesProfile === companyId) {
        store.commit('setError', 'Доступ к данным компании заблокирован!')
        store.commit('clearDirectories')
        router.push('/')
      }
    })
  }

  async configProfile(payload) {
    await api.post(BASE_PATH + '/configProfile', payload)
    return true
  }

  async changePassword(payload) {
    const { data } = await api.post(BASE_PATH + '/change_password', payload)
    if (data.accessToken)
      localStorage.setItem('token', `Bearer ${data.accessToken}`)
    return true
  }

  async setPassword(payload) {
    const { data } = await api.post(BASE_PATH + '/set_password', payload)
    if (data.accessToken)
      localStorage.setItem('token', `Bearer ${data.accessToken}`)
    return data
  }

  async getById(id) {
    const { data } = await api.get(BASE_PATH + `/${id}`)
    return data
  }

  async logout() {
    await api.post(BASE_PATH + '/logout')
    return null
  }

  async forgotPassword(email) {
    await api.post(BASE_PATH + '/restore_password', { email })
    return true
  }

  async confirmEmail(token) {
    await api.post(BASE_PATH + '/confirm_email', { token })
    return true
  }

  async retryConfirmationEmail(email) {
    if (!email) return null
    await api.post(BASE_PATH + '/retry_confirmation_email', { email })
    return true
  }
}

export default new UserService()
