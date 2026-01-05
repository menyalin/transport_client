import { DocxTemplateBuilder } from '@/shared/utils'
import { TemplateDataBuilder } from './templateDataBuilder'

export const useDownloadTemplate = (invoiceAndOrders) => {
  function downloadHandler(template) {
    const invoice = invoiceAndOrders.value || invoiceAndOrders
    const orders = invoice.orders || []
    const reportData = new TemplateDataBuilder(invoice, orders)
    const filename = `${template.filenamePattern} №${reportData.docNumber} ${reportData.date}`
    DocxTemplateBuilder.createDocxFile(template, reportData, filename)
  }

  return {
    downloadHandler,
  }
}
