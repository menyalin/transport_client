import moment from 'moment'
import { helpers } from 'vuelidate/lib/validators'

export const isLaterThan = (startDate) =>
  helpers.withParams(
    { type: 'isLaterThan', eq: startDate },
    function (val, parentVm) {
      if (
        startDate &&
        val &&
        moment(val).isValid() &&
        moment(startDate).isValid()
      )
        return moment(startDate).isBefore(val)
      else return true
    }
  )
