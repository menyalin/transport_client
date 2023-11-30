import store from '@/store'
import api from '@/api'
import dayjs from 'dayjs'
import FileSaver from 'file-saver'

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

  async getAllowedPrintForms(agreement, client) {
    const { data } = await api.get(BASE_PATH + '/allowed_print_forms', {
      params: { agreement, client },
    })
    return data
  }

  async downloadDoc(
    id,
    body,
    filename = dayjs().format('YYYY_MM_DD hh.mm.ss') + '_tmp_doc'
  ) {
    try {
      const { data } = await api({
        url: BASE_PATH + '/' + id + '/download_docs',
        method: 'POST',
        responseType: 'blob',
        data: body,
      })
      const blob = new Blob([data], {
        type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      })

      FileSaver.saveAs(blob, filename + '.docx')
      return data || null
    } catch (e) {
      store.commit('setError', e.message)
      return null
    }
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
    if (!params.rowIds || params.rowIds.length === 0)
      throw new Error(
        'PaymentInvoiceService:deleteOrdersFromPaymentInvoice: _id is missing!'
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

  async updatePrices(orderId) {
    const { data } = await api.put(BASE_PATH + '/update_prices/' + orderId)
    return data
  }
}

export default new PaymentInvoiceService()
