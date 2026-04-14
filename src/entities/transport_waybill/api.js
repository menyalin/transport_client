import api from '@/api'
import FileSaver from 'file-saver'
const BASE_PATH = '/transport_waybills'

class TransportWaybillService {
  constructor() {
    // Socket события можно использовать в компонентах для реактивности
    // transport-waybill:created — при создании
    // transport-waybill:updated — при обновлении
    // transport-waybill:deleted — при удалении
  }

  // Получить список транспортных накладных
  async getList(params) {
    const { data } = await api.get(BASE_PATH, { params })
    return data
  }

  // Получить транспортную накладную по ID
  async getById(id) {
    const { data } = await api.get(`${BASE_PATH}/${id}`)
    return data
  }

  // Получить транспортные накладные по ID заказа
  async getByOrderId(orderId) {
    const { data } = await api.get(`${BASE_PATH}/order/${orderId}`)
    return data
  }

  async downloadDoc(id, body) {
    const response = await api({
      url: BASE_PATH + '/' + id + '/download_docs',
      method: 'POST',
      responseType: 'blob',
      data: body,
    })

    // Проверяем статус ответа
    if (response.status !== 200) {
      // Пробуем распарсить ошибку
      const errorText = await response.data.text()
      const error = JSON.parse(errorText)
      throw new Error(error.message || 'Ошибка скачивания файла')
    }

    const blob = new Blob([response.data], {
      type: response.headers['content-type'],
    })

    let filename = `waybill_${id}.pdf`
    const contentDisposition = response.headers['content-disposition']
    if (contentDisposition) {
      const match = /filename="?([^"]+)"?/.exec(contentDisposition)
      if (match?.[1]) {
        filename = decodeURIComponent(match[1])
      }
    }

    FileSaver.saveAs(blob, filename)
  }

  // Создать транспортную накладную
  async create(body) {
    const { data } = await api.post(BASE_PATH, body)
    return data
  }

  // Обновить транспортную накладную
  async update(id, body) {
    const { data } = await api.put(`${BASE_PATH}/${id}`, body)
    return data
  }

  // Удалить транспортную накладную
  async deleteById(id) {
    if (!id) {
      console.log('id is missing: ', id)
      return
    }
    const { data } = await api.delete(`${BASE_PATH}/${id}`)
    return data
  }
}

export default new TransportWaybillService()
