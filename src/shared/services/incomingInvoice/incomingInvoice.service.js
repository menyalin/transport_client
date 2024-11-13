import store from '@/store'
import api from '@/api'
import dayjs from 'dayjs'
import FileSaver from 'file-saver'
import { z } from 'zod'
const BASE_PATH = '/incoming_invoice'

class IncomingInvoiceService {
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

  // async getPaymentInvocesListFile(params) {
  //   try {
  //     const { data } = await api({
  //       url: BASE_PATH + '/download_list',
  //       method: 'GET',
  //       responseType: 'blob',
  //       params: params,
  //     })
  //     const blob = new Blob([data], {
  //       type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  //     })
  //     const filename = dayjs().format('YYYY_MM_DD hh.mm.ss') + '_invoices.xlsx'
  //     FileSaver.saveAs(blob, filename)
  //     return data || null
  //   } catch (e) {
  //     store.commit('setError', e.message)
  //     return null
  //   }
  // }

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

  async addOrdersToIncomingInvoice(body) {
    try {
      const payloadSchema = z.object({
        incomingInvoiceId: z.string(),
        orders: z.array(z.string()).nonempty(),
        company: z.string().default(store.getters.directoriesProfile),
      })
      const parsedBody = payloadSchema.parse(body)

      const { data } = await api.post(
        BASE_PATH + '/orders/' + parsedBody.incomingInvoiceId,
        parsedBody
      )
      return data
    } catch (e) {
      store.commit('setError', e.message)
      return null
    }
  }

  async deleteOrdersFromIncomingInvoice(params) {
    if (!params.rowIds || params.rowIds.length === 0)
      throw new Error(
        'IncomingInvoiceService : deleteOrdersFromIncomingInvoice: _id is missing!'
      )

    if (!params.paymentInvoiceId)
      throw new Error(
        'IncomingInvoiceService : deleteOrdersFromIncomingInvoice : incomingInvoiceId is missing!'
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

export default new IncomingInvoiceService()
