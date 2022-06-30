import dayjs from 'dayjs'
import { helpers } from 'vuelidate/lib/validators'

export const isLaterThan = (startDate) =>
  helpers.withParams({ type: 'isLaterThan', eq: startDate }, function (val) {
    if (
      startDate &&
      val &&
      dayjs(val).isValid() &&
      dayjs(startDate).isValid()
    )
      return dayjs(startDate).isSameOrBefore(val)
    else return true
  })
