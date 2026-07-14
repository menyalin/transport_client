import { onMounted, ref } from 'vue'
import { FileService } from '@/shared/services'

export const useEntityFiles = (props) => {
  const items = ref([])
  const selectedFiles = ref([])
  const dialog = ref(false)
  const loading = ref(false)
  const uploading = ref(false)
  const uploadProgress = ref({})
  const uploadErrors = ref([])
  let abortController = null

  const uploadProgressHandler = (filename) => (progressEvent) => {
    if (progressEvent.lengthComputable) {
      const progress = Math.round((progressEvent.loaded / progressEvent.total) * 100)
      uploadProgress.value = { ...uploadProgress.value, [filename]: progress }
    }
  }

  const uploadFilesHandler = async () => {
    if (!selectedFiles.value?.length || !props.itemId || !props.docType) return

    uploading.value = true
    uploadErrors.value = []
    uploadProgress.value = {}
    abortController = new AbortController()

    const files = Array.from(selectedFiles.value)

    try {
      const results = await Promise.all(
        files.map(async (file) => {
          if (abortController.signal.aborted) return { name: file.name, cancelled: true }

          let key = null
          try {
            const uploadInfo = await getFileUploadUrl(file, abortController.signal)
            if (!uploadInfo || abortController.signal.aborted)
              return { name: file.name, cancelled: true }

            key = uploadInfo.key
            await FileService.uploadFile(
              uploadInfo.url,
              file,
              key,
              uploadProgressHandler(file.name),
              abortController.signal
            )

            return { name: file.name, key, ok: true }
          } catch (e) {
            if (key) {
              try {
                await FileService.deleteObject(key)
              } catch (cleanupErr) {
                console.log('Ошибка очистки записи после провала загрузки:', cleanupErr)
              }
            }

            const message =
              e?.name === 'CanceledError' || e?.code === 'ERR_CANCELED'
                ? 'Загрузка отменена'
                : e?.response?.data?.message || e?.message || 'Ошибка загрузки'

            return { name: file.name, key, error: message }
          }
        })
      )

      uploadErrors.value = results.filter((r) => r?.error)

      if (uploadErrors.value.length === 0) {
        closeUploadDialog()
      }
    } catch (e) {
      console.log('Ошибка при загрузке файлов:', e)
    } finally {
      uploading.value = false
      abortController = null
    }
  }

  const cancelOrAbortHandler = () => {
    if (uploading.value && abortController) {
      abortController.abort()
    }
    closeUploadDialog()
  }

  const closeUploadDialog = async () => {
    selectedFiles.value = []
    uploadProgress.value = {}
    uploadErrors.value = []
    dialog.value = false
    uploading.value = false
    await getFiles()
  }

  const getFileUploadUrl = async (file, signal) => {
    return await FileService.getUploadUrl(
      {
        docType: props.docType,
        docId: props.itemId,
        originalName: file.name,
        contentType: file.type,
        size: file.size,
        note: file.note,
      },
      signal
    )
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

  const cancelDialogHandler = () => {
    cancelOrAbortHandler()
  }

  const downloadItemHandler = async (item) => {
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

  const removeItemHandler = async (key) => {
    try {
      loading.value = true
      await FileService.deleteObject(key)
      items.value = items.value.filter((i) => i.key !== key)
    } catch (e) {
      console.log('Ошибка удаления файла: ', e)
    } finally {
      loading.value = false
    }
  }

  const updateNoteHandler = async (item) => {
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
    uploading,
    items,
    getFilesHandler: getFiles,
    openDialogHandler,
    cancelDialogHandler,
    cancelOrAbortHandler,
    closeUploadDialog,
    dialog,
    selectedFiles,
    uploadProgress,
    uploadErrors,
    removeItemHandler,
    downloadItemHandler,
    updateNoteHandler,
  }
}
