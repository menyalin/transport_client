import dayjs from 'dayjs'

export default () => {
  const dateM = dayjs()
  dateM.add(-1, 'day')
  return [dateM.startOf('day').format(), dateM.endOf('day').format()]
}
