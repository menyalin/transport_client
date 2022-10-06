export default (route) => {
  const loadingPoints = route.filter((p) => p.type === 'loading')
  const unloadingPoints = route.filter(
    (p) => p.type === 'unloading' && !p.isReturn
  )
  const loadingArrivalDate = loadingPoints[0].arrivalDate
  const loadingDepartureDate =
    loadingPoints[loadingPoints.length - 1].departureDate
  const unloadingArrivalDate = unloadingPoints[0].arrivalDate
  const unloadingDepartureDate =
    unloadingPoints[unloadingPoints.length - 1].departureDate
  let resStr = '<table><tr>'
  resStr += '<td>' + new Date(loadingArrivalDate).toLocaleDateString() + '</td>'
  resStr += '<td>' + new Date(loadingArrivalDate).toLocaleTimeString() + '</td>'
  resStr +=
    '<td>' + new Date(loadingDepartureDate).toLocaleDateString() + '</td>'
  resStr +=
    '<td>' + new Date(loadingDepartureDate).toLocaleTimeString() + '</td>'
  resStr +=
    '<td>' + new Date(unloadingArrivalDate).toLocaleDateString() + '</td>'
  resStr +=
    '<td>' + new Date(unloadingArrivalDate).toLocaleTimeString() + '</td>'
  resStr +=
    '<td>' + new Date(unloadingDepartureDate).toLocaleDateString() + '</td>'
  resStr +=
    '<td>' + new Date(unloadingDepartureDate).toLocaleTimeString() + '</td>'

  resStr += '</tr></table>'
  var data = [
    // eslint-disable-next-line no-undef
    new ClipboardItem({
      'text/html': new Blob([resStr], { type: 'text/html' }),
    }),
  ]
  navigator.clipboard.write(data).then()
}
