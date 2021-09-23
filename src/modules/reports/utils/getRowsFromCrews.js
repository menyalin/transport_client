const _truckSorter = (a, b) => {
  if (a.order < b.order) return -1
  else return 1
}

export default (crews, type = 'truck') => {
  if (!type || !['truck', 'driver', 'trailer'].includes(type))
    throw new Error('required argument not existed')
  if (!crews) return []

  const tmpCrews = crews.slice()

  let rows = []
  for (let i = 0; i < tmpCrews.length; i++) {
    if (rows.findIndex((item) => item._id === tmpCrews[i][type]._id) === -1) {
      rows.push({ ...tmpCrews[i][type], title: tmpCrews[i][type].regNum })
    }
  }
  return rows.sort(_truckSorter)
}
