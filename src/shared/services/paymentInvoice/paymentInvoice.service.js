import api from '@/api'
const BASE_PATH = '/payment_invoice'

class PaymentInvoiceService {
  
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

  async getById(id) {
    let { data } = await api.get(BASE_PATH + '/' + id)
    return data
  }

  async deleteById(id) {
    let data = await api.delete(BASE_PATH + '/' + id)
    return data
  }
}

export default new PaymentInvoiceService()
