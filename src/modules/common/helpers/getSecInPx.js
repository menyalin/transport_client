import moment from 'moment'

export default ({ lengthInPx, dayCount }) => {
  if (!lengthInPx || dayCount === 0) return null
  const dSec = dayCount * 24 * 60 * 60
  return dSec / lengthInPx
}
