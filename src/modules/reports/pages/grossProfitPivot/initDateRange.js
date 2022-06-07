import moment from 'moment'

export default () => {
  const dateM = moment()
  dateM.add(-1, 'day')
  return [dateM.startOf('day').format(), dateM.endOf('day').format()]
}
