import store from '@/store'
import api from '@/api'
import FileSaver from 'file-saver'
import dayjs from 'dayjs'

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

  async getDriversGradesReportFile(dateRange) {
    try {
      const { data } = await api({
        url: BASE_PATH + '/drivers_grades',
        method: 'POST',
        responseType: 'blob',
        data: {
          dateRange: dateRange,
          company: store.getters.directoriesProfile,
        },
      })
      const blob = new Blob([data], {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      })
      const filename =
        dayjs().format('YYYY_MM_DD hh.mm.ss') + '_driversGrades.xlsx'
      FileSaver.saveAs(blob, filename)
      return data || null
    } catch (e) {
      store.commit('setError', e.message)
      return null
    }
  }

  async grossProfit(body) {
    try {
      const { data } = await api.post(BASE_PATH + '/gross_profit', {
        ...body,
      })
      return data
    } catch (e) {
      store.commit('setError', e.message)
      return null
    }
  }

  async grossProfitPivot(body) {
    try {
      const { data } = await api.post(BASE_PATH + '/gross_profit_pivot', {
        ...body,
      })
      return data
    } catch (e) {
      store.commit('setError', e.message)
      return null
    }
  }
  async grossProfitDetailsData(body) {
    try {
      const { data } = await api.post(BASE_PATH + '/gross_profit_details', {
        ...body,
      })
      return data
    } catch (e) {
      store.commit('setError', e.message)
      return null
    }
  }

  async orderDocs(body) {
    try {
      const { data } = await api.post(BASE_PATH + '/order_docs', {
        ...body,
        company: store.getters.directoriesProfile,
      })
      return data
    } catch (e) {
      store.commit('setError', e.message)
      return []
    }
  }

  async ordersWOInvoice(body) {
    try {
      const { data } = await api.post(BASE_PATH + '/orders_wo_invoice', {
        ...body,
        company: store.getters.directoriesProfile,
      })
      return data
    } catch (e) {
      store.commit('setError', e.message)
      return []
    }
  }
}

export default new ReportService()
