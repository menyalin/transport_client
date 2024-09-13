import { helpers } from '@vuelidate/validators'
import dayjs from 'dayjs'

export const isLaterThan = (startDate) =>
  helpers.withParams({ type: 'isLaterThan', eq: startDate }, (val) => {
    if (startDate && val && dayjs(val).isValid() && dayjs(startDate).isValid())
      return dayjs(startDate).isSameOrBefore(val)
    else return true
  })
