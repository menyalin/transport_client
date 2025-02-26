import { onMounted, ref } from 'vue'
import { FileService } from '@/shared/services'

export const useEntityFiles = (props) => {
  const items = ref([])

  const loading = ref(false)

  const uploadFilesHandler = async (val) => {
    if (!val) return
    const presignedUploadUrl = await FileService.getUploadUrl({
      docType: props.docType,
      docId: props.itemId,
      originalName: val.name,
      contentType: val.type,
      size: val.size,
      note: 'some note',
    })

    await FileService.uploadFile(presignedUploadUrl, val)
    console.log('файл загружен')
  }

  async function getFiles() {
    try {
      loading.value = true
      items.value = await FileService.getFilesInfoByDocId(props.itemId)
    } catch (e) {
      console.log(e)
    } finally {
      loading.value = false
    }
  }

  onMounted(async () => {
    console.log('props:  ', props)
    await getFiles()
  })

  return { uploadFilesHandler, loading, items, getFilesHandler: getFiles }
}
