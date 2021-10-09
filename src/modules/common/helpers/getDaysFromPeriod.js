import moment from 'moment'
const TITLE_FORMAT = 'DD.MM.YY'

export default (period) => {
  if (!period || period.length !== 2)
    throw new Error('function expected "period" data')
  if (isNaN(Date.parse(period[0])) || isNaN(Date.parse(period[1])))
    throw new Error('wrong date format')
  const today = moment()
  const startDate = moment(period[0])
  const endDate = moment(period[1])

  if (startDate > endDate) throw new Error('wrong period')
  let res = []
  while (startDate.isSameOrBefore(endDate, 'day')) {
    res.push({
      title: startDate.format(TITLE_FORMAT),
      isToday: startDate.isSame(today, 'day'),
    })
    startDate.add(1, 'day')
  }
  return res
}
