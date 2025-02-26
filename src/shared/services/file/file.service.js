import api from '@/api'
import z from 'zod'
import axios from 'axios'
const BASE_PATH = '/storage'

class FileService {
  async getFilesInfoByDocId(docId) {
    let { data } = await api.get(BASE_PATH + '/' + docId)
    if (!Array.isArray(data))
      throw new Error('Нужен массив!! пришло что-то другое!')
    return data
  }

  async uploadFile(url, file) {
    await axios.put(url, file)
  }

  async getUploadUrl(data) {
    const paramsSchema = z.object({
      docType: z.string(),
      docId: z.string(),
      originalName: z.string(),
      contentType: z.string(),
      size: z.number(),
      note: z.string(),
    })
    try {
      const parsedData = paramsSchema.parse(data)
      const { data: url } = await api.put(
        BASE_PATH + '/generate_upload_url',
        parsedData
      )
      return url
    } catch (e) {
      console.dir('getUploadUrl: ', e)
    }
  }
}

export default new FileService()
