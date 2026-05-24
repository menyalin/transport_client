import dayjs from 'dayjs'

export const isLaterThan = (startDate) => ({
  $validator: (val) => {
    if (startDate && val && dayjs(val).isValid() && dayjs(startDate).isValid())
      return dayjs(startDate).isSameOrBefore(val)
    return true
  },
  $message: ({ $params }) =>
    `Дата должна быть не ранее ${dayjs($params.startDate).format('DD.MM.YYYY')}`,
  $params: { startDate },
})
