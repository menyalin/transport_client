export const useEntityFileHelpers = () => {
  const mimeTypeToIcon = (mimeType) => {
    const map = {
      'application/pdf': 'mdi-file-pdf-box',
      'application/msword': 'mdi-file-document-outline',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document':
        'mdi-file-document-outline',
      'application/vnd.ms-excel': 'mdi-file-excel',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet':
        'mdi-file-excel',
      'image/jpeg': 'mdi-file-image',
      'image/png': 'mdi-file-image',
      'image/gif': 'mdi-file-image',
      'text/plain': 'mdi-file-document-outline',
      'application/zip': 'mdi-archive',
      // Добавьте другие соответствия по необходимости
    }
    return map[mimeType] || 'mdi-file'
  }

  const formatSize = (size) => {
    const i = Math.round(Math.log(size) / Math.log(1024))
    return (
      (size / Math.pow(1024, i)).toFixed(2) * 1 +
      ' ' +
      ['Б', 'КБ', 'МБ', 'ГБ', 'ТБ'][i]
    )
  }

  const formatDate = (date) => {
    const options = {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }
    return new Date(date).toLocaleDateString('ru-RU', options)
  }
  return {
    mimeTypeToIcon,
    formatSize,
    formatDate,
  }
}
