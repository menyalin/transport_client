import { ref, computed } from 'vue'
import { required } from '@vuelidate/validators'
import { useVuelidate } from '@vuelidate/core'

const initialState = {
  name: null,
  agreement: null,
  startDate: null,
  endDate: null,
  orderType: 'city', // Город / Регион
  withVat: false,
  note: null,
}

export const useTariffContractForm = (_props) => {
  const orderTypeItems = [
    { text: 'Город', value: 'city' },
    { text: 'Регион', value: 'region' },
  ]
  let state = ref(initialState)

  const rules = {
    name: { required },
    agreement: { required },
    startDate: { required },
    endDate: {},
    orderType: { required }, // Город / Регион
    withVat: { required },
    note: {},
  }
  const disableSubmitBtn = computed(() => {
    return invalidForm.value
  })
  const v$ = useVuelidate(rules, state)
  const invalidForm = computed(() => v$.value.$invalid)
  const formState = computed(() => {
    return {
      ...state.value,
      startDate: new Date(state.value.startDate).toISOString(),
      endDate: state.value.endDate
        ? new Date(state.value.endDate).toISOString()
        : null,
    }
  })
  function submitHandler() {
    console.log('submit: ', formState.value)
  }
  return {
    state,
    v$,
    invalidForm,
    orderTypeItems,
    disableSubmitBtn,
    submitHandler,
  }
}
