import moment from 'moment'

export default ({ lengthInPx, period }) => {
  if (!lengthInPx || period.length !== 2) return null
  const dSec =
    moment(period[1]).add(24, 'hour').unix() - moment(period[0]).unix()
  return dSec / lengthInPx
}
