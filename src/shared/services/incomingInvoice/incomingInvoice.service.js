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

  async getInvoiceOrders(params) {
    try {
      const payloadSchema = z.object({
        incomingInvoiceId: z.string(),
        limit: z.number().optional().default(100),
        skip: z.number().optional().default(0),
        company: z.string().default(store.getters.directoriesProfile),
      })
      const parsedBody = payloadSchema.parse(params)

      const { data } = await api.get(
        BASE_PATH + '/orders/' + parsedBody.incomingInvoiceId,
        {
          params: {
            limit: parsedBody.limit,
            skip: parsedBody.skip,
            company: parsedBody.company,
          },
        }
      )
      return data
    } catch (e) {
      store.commit('setError', e.message)
      return null
    }
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

  async getAllowedPrintForms() {
    const { data } = await api.get(BASE_PATH + '/allowed_print_forms')
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

  async removeOrders(invoiceId, orderIds) {
    let { data } = await api.delete(BASE_PATH + '/orders/' + invoiceId, {
      data: { orderIds },
    })
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
