import dayjs from 'dayjs'

const _getPeriodFromDate = (dateStr, a, b) => [
  dayjs(dateStr).add(a, 'd').format('YYYY-MM-DD'),
  dayjs(dateStr).add(b, 'd').format('YYYY-MM-DD'),
]

export default ({ width, date }) => {
  switch (true) {
    case width > 3000:
      return _getPeriodFromDate(date, -3, 3, 7)
    case width > 1900:
      return _getPeriodFromDate(date, -2, 3, 6)
    case width > 1680:
      return _getPeriodFromDate(date, -1, 3, 5)
    case width > 1470:
      return _getPeriodFromDate(date, -1, 2, 4)
    case width > 1100:
      return _getPeriodFromDate(date, -1, 1, 3)
    case width > 660:
      return _getPeriodFromDate(date, 0, 1, 2)
    case width > 500:
      return _getPeriodFromDate(date, 0, 0, 1)
    default:
      return _getPeriodFromDate(date, 0, 0, 1)
  }
}
