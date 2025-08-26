import api from '@/api'
import socket from '@/socket'
import store from '@/store'
import dayjs from 'dayjs'
import FileSaver from 'file-saver'
import z from 'zod'

const BASE_PATH = '/crews'

class CrewService {
  constructor() {
    socket.on('crew:created', (data) => {
      store.commit('addCrew', data)
    })
    socket.on('crew:updated', (data) => {
      store.commit('updateCrew', data)
    })
    socket.on('crew:deleted', (id) => {
      store.commit('deleteCrew', id)
    })
  }

  async create(body) {
    let { data } = await api.post(BASE_PATH, body)
    return data
  }

  async updateOne(id, body) {
    let { data } = await api.put(BASE_PATH + '/' + id, body)
    return data
  }

  async getList(params) {
    let { data } = await api.get(BASE_PATH, { params })
    return data
  }

  async getActualCrewsOnCurrentDate(params) {
    try {
      const { data } = await api.get(BASE_PATH + '/actual', { params })
      return data
    } catch (e) {
      store.commit('setError', e.message)
    }
  }

  async getCrewByDriverAndDate(params) {
    const paramsSchema = z.object({
      driver: z.string(),
      date: z.string(),
    })
    const parsedData = paramsSchema.parse(params)

    try {
      const response = await api.get(BASE_PATH + '/by_driver', {
        params: parsedData,
      })
      return response?.data
    } catch (e) {
      store.commit('setError', e.message)
    }
  }

  async getCrewListFile(params) {
    try {
      const { data } = await api({
        url: BASE_PATH + '/download_list',
        method: 'GET',
        responseType: 'blob',
        params: params,
      })
      const blob = new Blob([data], {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      })
      let periodStr
      const dateFormat = 'YYYY-MM-DD'
      const { period } = params

      if (period && period.length === 2)
        periodStr =
          dayjs(period[0]).format(dateFormat) +
          '_' +
          dayjs(period[1]).format(dateFormat)
      else periodStr = dayjs().format('YYYY_MM_DD hh.mm.ss')

      const filename = periodStr + '_crews.xlsx'
      FileSaver.saveAs(blob, filename)
      return data || null
    } catch (e) {
      store.commit('setError', e.message)
      return null
    }
  }

  async getActualCrewByTruck(truck) {
    try {
      const params = { truck }
      const { data } = await api.get(BASE_PATH + '/by_truck', { params })
      return data
    } catch (e) {
      store.commit('setError', e.message)
    }
  }

  async getCrewByTruckAndDate({ truck, date }) {
    try {
      const params = { truck, date }
      const response = await api.get(BASE_PATH + '/by_truck_and_date', {
        params,
      })
      return response?.data
    } catch (e) {
      store.commit('setError', 'getCrewByTruckAndDate: ' + e.message)
    }
  }

  async closeCrew(id, date, type = 'crew') {
    let { data } = await api.put(BASE_PATH + '/close/' + id, {
      endDate: date,
      type,
    })
    return data
  }

  async getById({ id, forEdit }) {
    try {
      const params = { forEdit }
      let { data } = await api.get(BASE_PATH + '/' + id, { params })
      return data
    } catch (e) {
      store.commit('setError', e.message)
    }
  }

  async deleteById(id) {
    let data = await api.delete(BASE_PATH + '/' + id)
    return data
  }

  async diagramReport(params) {
    let { data } = await api.get(BASE_PATH + '/reports/crew_diagram', {
      params,
    })
    return data
  }

  async isValidTransportRow(params) {
    const paramsSchema = z.object({
      truck: z.string(),
      trailer: z.string().optional(),
      startDate: z.string(),
      endDate: z.string().optional(),
    })
    const parsedData = paramsSchema.parse(params)
    let { data } = await api.get(BASE_PATH + '/is_valid_transport_row', {
      params: parsedData,
    })
    return data
  }
}

export default new CrewService()
