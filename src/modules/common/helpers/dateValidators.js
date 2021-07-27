import moment from 'moment'
import { helpers } from 'vuelidate/lib/validators'

export const isLaterThan = (startDate) =>
  helpers.withParams(
    { type: 'isLaterThan', eq: startDate },
    function (val, parentVm) {
      const startDateStr = helpers.ref(startDate, this, parentVm)
      if (val && moment(val).isValid() && moment(startDateStr).isValid()) {
        return moment(startDateStr).isBefore(val)
      } else return true
    }
  )
