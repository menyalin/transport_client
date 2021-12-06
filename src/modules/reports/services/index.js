import api from '@/api'
const BASE_PATH = '/reports'

class ReportService {
  async daysControl(params) {
    const { data } = await api.get(BASE_PATH + '/daysControl', { params })
    return data
  }
}

export default new ReportService()
