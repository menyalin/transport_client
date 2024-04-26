import api from '@/api'
import store from '@/store'
import socket from '@/socket'
const BASE_PATH = '/companies'

class CompanyService {
  constructor() {
    socket.on('company:updated', (payload) => {
      store.commit('updateCompany', payload)
    })
    socket.on('company:deleteEmployeeById', (payload) => {
      store.commit('deleteEmployee', payload)
    })
    socket.on('company:updateSettings', ({ settings, companyId }) => {
      store.commit('updateCompanySettings', {
        settings,
        companyId,
      })
    })
  }

  async getMyCompanies() {
    const { data } = await api.get(BASE_PATH)
    return data
  }

  async create(body) {
    const res = await api.post(BASE_PATH, body)
    return res
  }

  async isExistInn(inn) {
    const { data } = await api.get(BASE_PATH + '/exist_inn', {
      params: { inn },
    })
    return data
  }

  async updateOne(id, body) {
    if (!store.getters.hasPermission('fullAccess')) {
      store.commit('setError', 'Нет прав на выполнение операции')
      return null
    }
    try {
      const { data } = await api.put(BASE_PATH + '/' + id, body)
      return data
    } catch (e) {
      store.commit('setError', e.response?.data || e.message)
      return false
    }
  }

  async updateSettings({ settings }) {
    if (!store.getters.hasPermission('fullAccess')) {
      store.commit('setError', 'Нет прав на выполнение операции')
      return null
    }
    const companyId = store.getters.directoriesProfile
    const { data } = await api.put(
      BASE_PATH + '/settings/' + companyId,
      settings
    )
    return data
  }
}

export default new CompanyService()
