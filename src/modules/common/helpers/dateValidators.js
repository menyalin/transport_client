import moment from 'moment'
import { helpers } from 'vuelidate/lib/validators'

export const isLaterThan = (startDate) =>
  helpers.withParams({ type: 'isLaterThan', eq: startDate }, function (val) {
    if (
      startDate &&
      val &&
      moment(val).isValid() &&
      moment(startDate).isValid()
    )
      return moment(startDate).isSameOrBefore(val)
    else return true
  })
