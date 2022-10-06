const ALLOWED_TYPES_GROUP = ['truck', 'trailer', 'driver']

const _getRowTitle = ({ crew, type }) => {
  switch (type) {
    case 'truck': {
      return crew.truck.regNum
    }
    case 'trailer': {
      return crew.trailer.regNum
    }
    case 'driver': {
      return crew.driver.surname + ' ' + crew.driver.name[0] + '.'
    }
  }
}

const _rowSorter = (type) => (a, b) => {
  switch (type) {
    case 'driver':
      if (a.surname < b.surname) return -1
      else return 1
    default:
      if (a.order < b.order) return -1
      else return 1
  }
}

export default (crews, type) => {
  if (!type || !ALLOWED_TYPES_GROUP.includes(type))
    throw new Error('required argument not existed')
  if (!crews || !crews.length) return []
  
  const tmpCrews = crews.slice()

  let rows = []
  for (let i = 0; i < tmpCrews.length; i++) {
    if (rows.findIndex((item) => item._id === tmpCrews[i][type]?._id) === -1) {
      if (type === 'trailer' && !tmpCrews[i].trailer) {
        // console.log('12')
      } else {
        rows.push({
          ...tmpCrews[i][type],
          title: _getRowTitle({ crew: tmpCrews[i], type }),
          _id: tmpCrews[i][type]._id,
        })
      }
    }
  }
  return rows.sort(_rowSorter)
}
