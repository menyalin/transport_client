import dayjs from 'dayjs'

export default () => {
  const dateM = dayjs()
  dateM.add(-1, 'M')
  return [dateM.startOf('month').format(), dateM.endOf('month').format()]
}
