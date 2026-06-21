export function getTableForClipboard(headers, rows) {
  let resStr = '<html><body><table style="border-collapse: collapse;">'
  resStr +=
    '<tr>' +
    headers.reduce((accum, item) => {
      return (accum += `<th style="border: 1px solid gray; font-size: 12px; padding: 3px;">${item.text}</th>`)
    }, '') +
    '</tr>'

  for (let i = 0; i < rows.length; i++) {
    resStr +=
      '<tr>' +
      headers.reduce((accum, item) => {
        return (accum += `<td style="border: 1px solid gray; font-size: 12px; padding: 3px;">${
          rows[i][item.value]
        }</td>`)
      }, '') +
      '</tr>'
  }

  return resStr + '</table></body></html>'
}

export async function copyToClipboard(headers, rows) {
  const html = getTableForClipboard(headers, rows)
  if (!window.ClipboardItem) return false
  try {
    const data = [new ClipboardItem({ 'text/html': new Blob([html], { type: 'text/html' }) })]
    await navigator.clipboard.write(data)
    return true
  } catch {
    return false
  }
}
