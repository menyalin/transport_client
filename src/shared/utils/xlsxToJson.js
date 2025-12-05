import api from '@/api'

export const xlsxToJson = async file => {
  let formData = new FormData()
  formData.append('file', file)

  const { data } = await api.post('utils/xlsx_to_json', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  })
  return data
}
