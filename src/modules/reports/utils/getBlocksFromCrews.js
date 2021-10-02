import moment from 'moment'
const ALLOWED_TYPES_GROUP = ['truck', 'trailer', 'driver']

const _getBlockTitle = ({ crew, type }) => {
  const intervalStr = crew.startDate + ' - ' + crew.endDate
  switch (type) {
    case 'truck': {
      return crew.truck.regNum + ' / ' + intervalStr
    }
    case 'trailer': {
      return crew.trailer.regNum + ' / ' + intervalStr
    }
    case 'driver': {
      return crew.driver.fullName + ' / ' + intervalStr
    }
  }
}

const _createBlock = ({ crew, type, group, line }) => ({
  type,
  line,
  title: _getBlockTitle({ crew, type }),
  rowId: crew[group]._id,
  [type]: crew[type],
  startDate: crew.startDate,
  endDate: crew.endDate,
})

export default ({ crews, group, displayPeriod }) => {
  let blocks = []
  if (!crews || !crews.length || !group)
    throw new Error('required argument not existed')
  if (!ALLOWED_TYPES_GROUP.includes(group))
    throw new Error(
      `the group parameter must be in the list: ${ALLOWED_TYPES_GROUP}`
    )

  for (let i = 0; i < crews.length; i++) {
    if (
      crews[i].endDate &&
      moment(crews[i].endDate).isSameOrBefore(displayPeriod[0])
    )
      continue
    if (moment(crews[i].startDate).isSameOrAfter(displayPeriod[1])) continue

    if (group === 'truck') {
      blocks.push(
        _createBlock({ crew: crews[i], type: 'driver', group, line: 1 })
      )
      if (crews[i].trailer) {
        blocks.push(
          _createBlock({ crew: crews[i], type: 'trailer', group, line: 2 })
        )
      }
    } else if (group === 'driver') {
      blocks.push(
        _createBlock({ crew: crews[i], type: 'truck', group, line: 1 })
      )
      if (crews[i].trailer) {
        blocks.push(
          _createBlock({ crew: crews[i], type: 'trailer', group, line: 2 })
        )
      }
    } else if (group === 'trailer') {
      if (crews[i].trailer) {
        blocks.push(
          _createBlock({ crew: crews[i], type: 'truck', group, line: 1 })
        )
        blocks.push(
          _createBlock({ crew: crews[i], type: 'driver', group, line: 2 })
        )
      }
    }
  }

  return blocks
}
