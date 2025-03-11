import z from 'zod'
import axios from 'axios'
import socket from '@/socket'
import api from '@/api'

const BASE_PATH = '/storage'

class FileService {
  async getFilesInfoByDocId(docId) {
    let { data } = await api.get(BASE_PATH + '/' + docId)
    if (!Array.isArray(data))
      throw new Error('Нужен массив!! пришло что-то другое!')
    return data
  }

  async uploadFile(url, file, key, uploadProgressHandler) {
    try {
      socket.emit('s3storage:uploadStarted', key)
      await axios.put(url, file, { onUploadProgress: uploadProgressHandler })
      socket.emit('s3storage:uploadCompleted', key)
    } catch (e) {
      socket.emit('s3storage:uploadFailed', key)
    }
  }

  async deleteObject(key) {
    await api.delete(BASE_PATH + '/delete_object', { params: { key } })
  }

  async getUploadUrl(data) {
    try {
      const paramsSchema = z.object({
        docId: z.string(),
        docType: z.string(),
        originalName: z.string(),
        contentType: z.string(),
        size: z.number(),
        note: z.string().optional().nullable(),
      })
      const parsedData = paramsSchema.parse(data)

      const { data: url } = await api.put(
        BASE_PATH + '/generate_upload_url',
        parsedData
      )
      return url
    } catch (e) {
      console.error('getUploadUrl : error ', e)
    }
  }

  async getDownloadUrl(key) {
    if (!key) return

    try {
      const { data: url } = await api.get(BASE_PATH + '/get_download_url', {
        params: { key },
      })
      return url
    } catch (e) {
      console.log('Ошибка получения presigned url')
    }
  }
}

export default new FileService()
