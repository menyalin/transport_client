import dayjs from 'dayjs'
const ALLOWED_TYPES_GROUP = ['truck', 'trailer', 'driver']

const _getBlockTitle = ({ crew, type }) => {
  let intervalStr = dayjs(crew.startDate).format('DD.MM.YY HH:mm') + ' - '
  if (crew.endDate) intervalStr = intervalStr.concat(dayjs(crew.endDate).format('DD.MM.YY HH:mm'))
  switch (type) {
    case 'truck': {
      return crew.truck.regNum + ' / ' + intervalStr
    }
    case 'trailer': {
      return crew.trailer.regNum + ' / ' + intervalStr
    }
    case 'driver': {
      const driverName = crew.driver.surname + ' ' + crew.driver.name
      return driverName + ' / ' + intervalStr
    }
  }
}

const _createBlock = ({ crew, type, group }) => ({
  type,
  crewId: crew.crewId,
  title: _getBlockTitle({ crew, type }),
  rowId: crew[group]._id,
  [type]: crew[type],
  startDate: crew.startDate,
  endDate: crew.endDate,
})

export default ({ crews, group, displayPeriod, analitic }) => {
  let blocks = []
  if (!crews || !group) throw new Error('required argument not existed')
  if (!ALLOWED_TYPES_GROUP.includes(group))
    throw new Error(`the group parameter must be in the list: ${ALLOWED_TYPES_GROUP}`)
  if (!crews.length) return []
  for (let i = 0; i < crews.length; i++) {
    if (crews[i].endDate && dayjs(crews[i].endDate).isBefore(displayPeriod[0])) continue
    if (dayjs(crews[i].startDate).isAfter(displayPeriod[1])) continue
    if ((analitic === 'trailer' || group === 'trailer') && !crews[i].trailer) continue
    blocks.push(_createBlock({ crew: crews[i], type: analitic, group }))
  }

  return blocks
}
