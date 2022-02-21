// Поиск дальнейшей точки относительно первой в списке по прямой (по рулетке)

export default (coordArray) => {
  if (!coordArray || coordArray.length < 2) return null
  let distArray = []
  for (let i = 1; i < coordArray.length; i++) {
    distArray.push(_distBetweenPoints(coordArray[0], coordArray[i]))
  }
  return Math.floor(Math.max(...distArray) / 10 / 100)
  // округление до целых вниз
}

const _distBetweenPoints = (a, b) => {
  const RAD = 6372795 // радиус земли
  const lat1 = (a[1] * Math.PI) / 180
  const lat2 = (b[1] * Math.PI) / 180
  const long1 = (a[0] * Math.PI) / 180
  const long2 = (b[0] * Math.PI) / 180

  const cl1 = Math.cos(lat1)
  const cl2 = Math.cos(lat2)
  const sl1 = Math.sin(lat1)
  const sl2 = Math.sin(lat2)
  const delta = long2 - long1
  const cdelta = Math.cos(delta)
  const sdelta = Math.sin(delta)

  const y = Math.sqrt(
    Math.pow(cl2 * sdelta, 2) + Math.pow(cl1 * sl2 - sl1 * cl2 * cdelta, 2)
  )
  const x = sl1 * sl2 + cl1 * cl2 * cdelta
  const ad = Math.atan2(y, x)
  return ad * RAD
}
