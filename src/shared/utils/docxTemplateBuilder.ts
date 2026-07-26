import Docxtemplater from 'docxtemplater'
import PizZip from 'pizzip'
import PizZipUtils from 'pizzip/utils/index.js'
import { saveAs } from 'file-saver'

export class DocxTemplateBuilder {
  static _getZipContent(url: string): Promise<PizZip> {
    return new Promise((resolve, reject) => {
      PizZipUtils.getBinaryContent(url, (err: Error | null, data: any) => {
        if (err) reject(err)
        else {
          const zip = new PizZip(data)
          resolve(zip)
        }
      })
    })
  }

  static async createDocxFile(
    template: { file: string },
    data: Record<string, any>,
    filename = 'новый файл'
  ): Promise<void> {
    let templateFile: PizZip | undefined
    const url = import.meta.env.VITE_STATIC_URL + `/templates/${template.file}`

    try {
      templateFile = await this._getZipContent(url)
    } catch (e) {
      console.dir(e)
    }

    if (!templateFile) return

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
