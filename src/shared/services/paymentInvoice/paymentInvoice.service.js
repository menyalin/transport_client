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

  async pickOrders(params) {
    let { data } = await api.get(BASE_PATH + '/pick_orders', { params })
    return data
  }

  async addOrdersToPaymentInvoice(params) {
    if (!params.orders || params.orders.length === 0)
      throw new Error(
        'PaymentInvoiceService:addOrdersToPaymentInvoice: orders is missing!'
      )

    if (!params.paymentInvoiceId)
      throw new Error(
        'PaymentInvoiceService:addOrdersToPaymentInvoice: paymentInvoiceId is missing!'
      )

    const { data } = await api.post(
      BASE_PATH + '/add_orders_to_invoice',
      params
    )
    return data
  }

  async deleteOrdersFromPaymentInvoice(params) {
    if (!params.orders || params.orders.length === 0)
      throw new Error(
        'PaymentInvoiceService:deleteOrdersFromPaymentInvoice: orders is missing!'
      )

    if (!params.paymentInvoiceId)
      throw new Error(
        'PaymentInvoiceService:deleteOrdersFromPaymentInvoice: paymentInvoiceId is missing!'
      )

    const { data } = await api.post(
      BASE_PATH + '/remove_orders_from_invoice',
      params
    )
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
