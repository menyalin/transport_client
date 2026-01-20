import { useAppStore } from '@/shared/useAppStore'
import { useVuelidate } from '@vuelidate/core'
import { required } from '@vuelidate/validators'
import { ref, watch, computed } from 'vue'
export const useForm = (props, ctx) => {
  const appStore = useAppStore()

  const defaultState = {
    name: null,
    cashPayment: false,
    note: null,
    date: null,
    endDate: null,
    vatRate: null,
    usePriceWithVAT: false,
    useCustomPrices: true,
    calcWaitingByArrivalDateLoading: false,
    calcWaitingByArrivalDateUnloading: false,
    noWaitingPaymentForAreLateLoading: false,
    noWaitingPaymentForAreLateUnloading: false,
    clients: [],
    closed: null,
    agreement: 0,
    priceRequired: false,
    clientNumRequired: false,
    auctionNumRequired: false,
    executorName: null,
    executor: null,
    allowedCarriers: [],
    actBasis: '',
    actDescription: '',
  }
  const state = ref(defaultState)
  const rules = computed(() => ({
    name: { required },
    date: { required },
    vatRate: { required },
  }))

  const v$ = useVuelidate(rules, state)

  const isInvalidForm = computed(() => v$.value.$invalid)

  function resetForm() {
    state.value = defaultState
  }
  function deleteHandler() {
    ctx.emit('delete')
  }
  function submitHandler() {
    ctx.emit('submit', {
      ...state.value,
      company: appStore.userCurrentProfile,
    })
    resetForm()
  }
  function cancelHandler() {
    ctx.emit('cancel')
    resetForm()
  }

  watch(
    () => props.agreement,
    (agreement) => (state.value = { ...defaultState, ...agreement }),
    { immediate: true }
  )
  watch(
    state,
    (val) => {
      if (val.vatRate === 0 && val.usePriceWithVAT)
        state.value.usePriceWithVAT = false
    },
    { deep: true }
  )

  return {
    v$,
    state,
    deleteHandler,
    submitHandler,
    cancelHandler,
    isInvalidForm,
  }
}
