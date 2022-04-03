import moment from 'moment'

export default () => {
  const dateM = moment()
  dateM.add(-1, 'M')
  return [dateM.startOf('month').format(), dateM.endOf('month').format()]
}
