import store from '@/store'
import api from '@/api'
const BASE_PATH = '/reports'

class ReportService {
  async daysControl(params) {
    const { data } = await api.get(BASE_PATH + '/daysControl', { params })
    return data
  }

  async ordersInProgress(params) {
    try {
      const { data } = await api.get(BASE_PATH + '/inProgressOrders', {
        params,
      })
      return data
    } catch (e) {
      store.commit('setError', e.message)
      return []
    }
  }

  async truckStateOnDate(params) {
    try {
      const { data } = await api.get(BASE_PATH + '/truckStateOnDate', {
        params,
      })
      return data
    } catch (e) {
      store.commit('setError', e.message)
      return []
    }
  }
}

export default new ReportService()
