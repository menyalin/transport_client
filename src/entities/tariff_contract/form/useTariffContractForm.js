import dayjs from 'dayjs'
import { reactive, computed, watch } from 'vue'
import { required } from '@vuelidate/validators'
import { useVuelidate } from '@vuelidate/core'

const initialState = {
  name: null,
  agreement: null,
  startDate: null,
  endDate: null,
  
  withVat: false,
  note: null,
  zonesTariffs: [],
  _version: 0,
}

export const useTariffContractForm = (props, ctx) => {
  const orderTypeItems = [
    { text: 'Город', value: 'city' },
    { text: 'Регион', value: 'region' },
  ]
  let state = reactive(initialState)

  function setState(newState) {
    Object.assign(state, newState, {
      startDate: dayjs(newState.startDate).format('YYYY-MM-DD'),
      endDate: newState.endDate
        ? dayjs(newState.startDate).format('YYYY-MM-DD')
        : null,
    })
  }

  const rules = {
    name: { required },
    agreement: { required },
    startDate: { required },
    endDate: {},
    
    withVat: { required },
    note: {},
    zonesTariffs: {},
  }
  const disableSubmitBtn = computed(() => {
    return invalidForm.value
  })
  const mainFormV$ = useVuelidate(rules, state)
  const invalidForm = computed(() => mainFormV$.value.$invalid)

  const formState = computed(() => {
    return {
      ...state,
      startDate: new Date(state.startDate + 'T00:00').toISOString(),
      endDate: state.endDate
        ? new Date(state.endDate + 'T00:00').toISOString()
        : null,
    }
  })

  const agreementReadonly = computed(() => {
    return props.item?.id
  })

  function submitHandler() {
    ctx.emit('submit', formState.value)
  }

  function cancelHandler() {
    ctx.emit('cancel')
  }

  watch(
    () => props.item,
    (val) => {
      if (val?._id) setState(val)
    },
    { immediate: true, deep: true }
  )

  return {
    state,
    mainFormV$,
    invalidForm,
    orderTypeItems,
    disableSubmitBtn,
    submitHandler,
    cancelHandler,
    agreementReadonly,
    formState,
  }
}
