import useVuelidate from '@vuelidate/core'
import { required } from '@vuelidate/validators'
import { reactive } from 'vue'

// import { isLaterThan } from '@/modules/common/helpers/dateValidators'

export const useTransportTableForm = () => {
  const state = reactive({
    startDate: null,
    endDate: null,
    truck: null,
    trailer: null,
    note: null,
  })
  // TODO: add isLaterThan validator
  const rules = {
    startDate: {
      required,
      // isLaterThan: isLaterThan(minDateValue),
    },
    endDate: {
      // isLaterThan: isLaterThan(this.newItem.startDate),
    },
  }
  const v$ = useVuelidate(rules, state)
  return { v$, state }
}
