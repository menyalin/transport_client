import { useVuelidate } from '@vuelidate/core'
import { required } from '@vuelidate/validators'
import { reactive } from 'vue'

export function useCrewForm() {
  const state = reactive({
    tkName: null,
    transport: [],
    driver: null,
    startDate: null,
    endDate: null,
    note: null,
  })

  const rules = {
    name: { required },
    transport: { required },
    dateFrom: { required, isLaterThan: isLaterThan('dateTo') },
    dateTo: { required },
    note: {},
  }
  const v$ = useVuelidate(rules, state)

  return { v$, state }
}
