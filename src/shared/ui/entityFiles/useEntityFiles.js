import { onMounted, ref } from 'vue'
import { FileService } from '@/shared/services'

export const useEntityFiles = props => {
  const items = ref([])
  const selectedFiles = ref([])
  const dialog = ref(false)
  const loading = ref(false)
  const uploadProgress = ref({})

  const uploadProgressHandler = filename => progressEvent => {
    if (progressEvent.lengthComputable) {
      const progress = Math.round((progressEvent.loaded / progressEvent.total) * 100)
      uploadProgress.value = { ...uploadProgress.value, [filename]: progress }
    }
  }

  const uploadFilesHandler = async () => {
    if (!selectedFiles.value?.length || !props.itemId || !props.docType) return
    loading.value = true
    const uploadPromises = Array.from(selectedFiles.value).map(async file => {
      const { url: uploadUrl, key } = await getFileUploadUrl(file)
      await FileService.uploadFile(uploadUrl, file, key, uploadProgressHandler(file.name))
    })

    await Promise.all(uploadPromises)
    cancelDialogHandler()
  }

  const getFileUploadUrl = async file => {
    return await FileService.getUploadUrl({
      docType: props.docType,
      docId: props.itemId,
      originalName: file.name,
      contentType: file.type,
      size: file.size,
      note: file.note,
    })
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

  const openDialogHandler = () => {
    dialog.value = true
  }

  const cancelDialogHandler = async () => {
    selectedFiles.value = []
    dialog.value = false
    loading.value = false
    uploadProgress.value = {}
    await getFiles()
  }

  const downloadItemHandler = async item => {
    const { key, originalName } = item
    if (!key || !originalName) return
    try {
      loading.value = true
      const presignedUrl = await FileService.getDownloadUrl(key)
      const link = document.createElement('a')
      link.href = presignedUrl

      link.style.display = 'none'
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    } catch (e) {
      console.log('Ошибка получения файла: ', e)
    } finally {
      loading.value = false
    }
  }

  const removeItemHandler = async key => {
    try {
      loading.value = true
      await FileService.deleteObject(key)
      items.value = items.value.filter(i => i.key !== key)
    } catch (e) {
      console.log('Ошибка удаления файла: ', e)
    } finally {
      loading.value = false
    }
  }

  const updateNoteHandler = async item => {
    try {
      loading.value = true
      await FileService.updateNote(item._id, item.note)
    } catch (e) {
      console.log('Ошибка обновления описания файла: ', e)
    } finally {
      loading.value = false
    }
  }

  onMounted(async () => {
    await getFiles()
  })

  return {
    uploadFilesHandler,
    loading,
    items,
    getFilesHandler: getFiles,
    openDialogHandler,
    cancelDialogHandler,
    dialog,
    selectedFiles,
    uploadProgress,
    removeItemHandler,
    downloadItemHandler,
    updateNoteHandler,
  }
}
