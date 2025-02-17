import { ref, computed, watch, getCurrentInstance } from 'vue'
import { useVuelidate } from '@vuelidate/core'
import { required } from '@vuelidate/validators'

export const useForm = (props, ctx) => {
  const { proxy } = getCurrentInstance()
  const initialState = {
    name: '',
    vatRate: 0,
    paymentOfDays: 0,
    usePriceWithVAT: false,
    paymentDescription: '',
    orderContractNote: '',
    note: '',
  }
  const state = ref(props?.item ?? initialState)
  const rules = computed(() => {
    return {
      name: { required },
      paymentOfDays: { required },
      vatRate: { required },
      paymentDescription: {},
      orderContractNote: {},
      usePriceWithVAT: {},
      note: {},
    }
  })

  const v$ = useVuelidate(rules, state)
  const invalidForm = computed(() => v$.value.$invalid)
  const vatRateDisabled = computed(() => {
    return !!proxy.$route.params.id
  })
  watch(
    () => props.item,
    (val) => {
      if (!val) return null
      state.value = val
    },
    { deep: true, immediate: true }
  )

  return {
    vatRateDisabled,
    state,
    v$,
    invalidForm,
    saveHandler: () => {
      ctx.emit('save', state.value)
    },
    submitHandler: () => {
      ctx.emit('submit', state.value)
    },
    cancelHandler: () => {
      ctx.emit('cancel')
    },
  }
}
