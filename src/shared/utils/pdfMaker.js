import pdfMake from 'pdfmake/build/pdfmake'
import pdfFonts from 'pdfmake/build/vfs_fonts'

class PdfMakeService {
  constructor({ pdfMake, pdfFonts }) {
    this.pdfMake = pdfMake
    this.pdfFonts = pdfFonts
    this.pdfMake.vfs = pdfFonts.pdfMake.vfs
  }

  download(dd, filename) {
    this.pdfMake.createPdf(dd).download(filename)
  }
}

export default new PdfMakeService({ pdfMake, pdfFonts })
