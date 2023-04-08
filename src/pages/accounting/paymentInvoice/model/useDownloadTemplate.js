import { DocxTemplateBuilder } from '@/shared/utils'
import { TemplateDataBuilder } from './templateDataBuilder'

export const useDownloadTemplate = (invoice) => {
  function downloadHandler(template) {
    const reportData = new TemplateDataBuilder(invoice.value)
    const filename = `${template.filenamePattern} №${reportData.docNumber} ${reportData.sendDate}`
    DocxTemplateBuilder.createDocxFile(template, reportData, filename)
  }

  return {
    downloadHandler,
  }
}
