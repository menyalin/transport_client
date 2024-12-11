import { useVuelidate } from '@vuelidate/core'
import { required } from '@vuelidate/validators'
import { ref, watch, computed, getCurrentInstance } from 'vue'
export const useForm = (props, ctx) => {
  const { proxy } = getCurrentInstance()
  const defaultState = {
    name: null,
    isOutsourceAgreement: false,
    cashPayment: false,
    note: null,
    date: null,
    vatRate: null,
    usePriceWithVAT: false,
    useCustomPrices: true,
    calcWaitingByArrivalDateLoading: false,
    calcWaitingByArrivalDateUnloading: false,
    noWaitingPaymentForAreLateLoading: false,
    noWaitingPaymentForAreLateUnloading: false,
    clients: [],
    outsourceCarriers: [],
    closed: null,
    agreement: 0,
    priceRequired: false,
    clientNumRequired: false,
    auctionNumRequired: false,
    commission: 0,
    executorName: null,
    executor: null,
    allowedCarriers: [],
    paymentDescription: null,
  }
  const state = ref(defaultState)
  const rules = computed(() => ({
    name: { required },
    date: { required },
    vatRate: { required },
  }))

  const v$ = useVuelidate(rules, state)

  const isInvalidForm = computed(() => v$.value.$invalid)
  const vatRates = computed(() => proxy.$store.getters.vatRates)
  const isOutsourceAgreement = computed(() => state.value.isOutsourceAgreement)
  const carriers = computed(() =>
    proxy.$store.getters.tkNames
      .map((i) => ({
        value: i._id,
        text: i.name,
      }))
      .sort((a, b) => a - b)
  )

  function resetForm() {
    state.value = defaultState
  }
  function deleteHandler() {
    ctx.emit('delete')
  }
  function submitHandler() {
    ctx.emit('submit', {
      ...state.value,
      company: proxy.$store.getters.directoriesProfile,
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
    vatRates,
    isOutsourceAgreement,
    carriers,
  }
}
