import api from '@/api'
import store from '@/store'
import socket from '@/socket'
const BASE_PATH = '/companies'

class CompanyService {
  constructor() {
    socket.on('company:updateCompany', (payload) => {
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

  getMyCompanies() {
    return new Promise((resolve, reject) => {
      api
        .get(BASE_PATH)
        .then(({ data }) => {
          resolve(data?.data)
        })
        .catch((e) => reject(e))
    })
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
