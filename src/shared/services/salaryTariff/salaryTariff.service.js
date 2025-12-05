import dayjs from 'dayjs'
import FileSaver from 'file-saver'
import api from '@/api'
import socket from '@/socket'
import store from '@/store'

const BASE_PATH = '/salary_tariffs'

class SalaryTariffService {
  constructor() {
    this.MODEL_NAME = 'salaryTariff'

    socket.on(this.MODEL_NAME + ':created', data => {
      store.commit('addToCache', data)
    })

    socket.on(this.MODEL_NAME + ':updated', data => {
      store.commit('addToCache', data)
    })
    socket.on(this.MODEL_NAME + ':deleted', id => {
      store.commit('deleteFromCache', id)
    })
  }

  async create(body) {
    let { data } = await api.post(BASE_PATH, body)
    return data
  }

  async updateOne({ _id, body }) {
    let { data } = await api.put(BASE_PATH + '/' + _id, body)
    return data
  }

  async getList(params) {
    let { data } = await api.get(BASE_PATH, { params })
    return data
  }

  async getById(id) {
    if (store.getters.cacheDirectories.has(id)) return store.getters.cacheDirectories.get(id)
    else {
      let { data } = await api.get(BASE_PATH + '/' + id)
      store.commit('addToCache', data)
      return data
    }
  }

  async getDriversSalaryByPeriod(body) {
    let { data } = await api.post(BASE_PATH + '/get_drivers_salary_by_period', {
      ...body,
      company: store.getters.directoriesProfile,
    })
    return data
  }

  async getDriverSalaryByPeriodReport(params) {
    function getFileName(params) {
      if (!params.period[0]) throw new Error('getDriverSalaryByPeriodReport : Не указан период')
      const startDate = dayjs(params.period[0])
      return `${startDate.format('YYYY_MM')}_ЗП_Водителей.xlsx`
    }

    try {
      const { data } = await api({
        url: BASE_PATH + '/drivers_salary_by_period_report',
        method: 'GET',
        responseType: 'blob',
        params: {
          ...params,
          company: store.getters.directoriesProfile,
        },
      })
      const blob = new Blob([data], {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      })

      const filename = getFileName(params)
      FileSaver.saveAs(blob, filename)
    } catch (e) {
      store.commit('setError', e.message)
    }
  }

  async deleteById(id) {
    let data = await api.delete(BASE_PATH + '/' + id)
    return data
  }
}

export default new SalaryTariffService()
