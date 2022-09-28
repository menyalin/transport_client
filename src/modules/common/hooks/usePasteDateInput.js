import dayjs from 'dayjs'

export const usePasteDateInput = () => {

  const pasteDate = (e) => {
       e.preventDefault()
      const inputDate = (e.clipboardData || window.clipboardData).getData('text/plain')
      let inputFormats
      let resultFormat
      if (e.target.type === 'date') { 
        inputFormats = ['DD MM YYYY', 'DD MM YY']
        resultFormat = 'YYYY-MM-DD'
      } else if (e.target.type === 'datetime-local') { 
        inputFormats = ['DD MM YYYY HH mm', 'DD MM YY HH:mm']
        resultFormat = 'YYYY-MM-DDTHH:mm'
      }
      const parsedDate = dayjs(inputDate, inputFormats)
      if (parsedDate.isValid()) 
        e.target.value = parsedDate.format(resultFormat)
        e.target.dispatchEvent(new Event('input'))
  }


  
  return {
    pasteDate
  }

}