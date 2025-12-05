import Docxtemplater from 'docxtemplater'
import PizZip from 'pizzip'
import PizZipUtils from 'pizzip/utils/index.js'
import { saveAs } from 'file-saver'

export class DocxTemplateBuilder {
  static _getZipContent(url) {
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

  static async createDocxFile(template, data, filename = 'новый файл') {
    let templateFile
    const url = import.meta.env.VITE_STATIC_URL + `/templates/${template.file}`

    try {
      templateFile = await this._getZipContent(url)
    } catch (e) {
      console.dir(e)
    }

    const doc = new Docxtemplater(templateFile, {
      paragraphLoop: true,
      linebreaks: true,
    })

    doc.render(data)

    const out = doc.getZip().generate({
      type: 'blob',
      mimeType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    })
    saveAs(out, `${filename}.docx`)
  }
}
