//  import { XLSXTemplateService } from '@/shared/services'
import Docxtemplater from 'docxtemplater'
import PizZip from 'pizzip'
import PizZipUtils from 'pizzip/utils/index.js'
import { saveAs } from 'file-saver'

function getZipContent(url) {
  return new Promise((resolve, reject) => {
    PizZipUtils.getBinaryContent(url, (err, data) => {
      if (err) reject(err)
      else {
        const zip = new PizZip(data)
        resolve(zip)
      }
    })
  })
}

export async function docsRegistryWordReport(reportData) {
  let data = null
  const url =
    import.meta.env.VITE_STATIC_URL + '/templates/docsRegistry_template.docx'
  try {
    data = await getZipContent(url)
  } catch (e) {
    console.dir(e)
  }

  const doc = new Docxtemplater(data, {
    paragraphLoop: true,
    linebreaks: true,
  })

  doc.render(reportData)

  const out = doc.getZip().generate({
    type: 'blob',
    mimeType:
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  })
  saveAs(out, `${reportData.fileNameStr}.docx`)
}
