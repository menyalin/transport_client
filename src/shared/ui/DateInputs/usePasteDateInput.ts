import dayjs from 'dayjs'

export const usePasteDateInput = () => {
  const pasteDate = (e: ClipboardEvent) => {
    e.preventDefault()
    const target = e.target as HTMLInputElement
    const inputDate = e.clipboardData?.getData('text/plain') || ''
    let inputFormats: string[]
    let resultFormat: string
    if (target.type === 'date') {
      inputFormats = ['DD MM YYYY', 'DD MM YY']
      resultFormat = 'YYYY-MM-DD'
    } else if (target.type === 'datetime-local') {
      inputFormats = ['DD MM YYYY HH mm', 'DD MM YY HH:mm']
      resultFormat = 'YYYY-MM-DDTHH:mm'
    } else {
      return
    }
    const parsedDate = dayjs(inputDate, inputFormats)
    if (parsedDate.isValid()) target.value = parsedDate.format(resultFormat)
    target.dispatchEvent(new Event('input'))
  }

  return {
    pasteDate,
  }
}
