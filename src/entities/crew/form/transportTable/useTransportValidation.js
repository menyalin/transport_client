import { required } from 'vuelidate/lib/validators'
import { isLaterThan } from '@/modules/common/helpers/dateValidators.js'
import { useVuelidate } from '@vuelidate/core'

export const useTransportValidation = (state) => {
  const rules = {
    startDate: { required },
    endDate: { required, isLaterThan: isLaterThan('startDate') },
  }
  const v$ = useVuelidate(rules, state)
  return { v$ }
}
