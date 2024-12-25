import { ref, computed, watch } from 'vue'
import { useVuelidate } from '@vuelidate/core'

export const useForm = (props, ctx) => {
  const initialState = {
    name: '',
    vatRate: 0,
    paymentOfDays: 0,
    paymentDescription: '',
    orderContractNote: '',
    note: '',
  }
  const state = ref(props?.item ?? initialState)
  const rules = computed(() => {
    return {
      name: { required: true },
      paymentOfDays: { required: true },
      vatRate: { required: true },
      paymentDescription: {},
      orderContractNote: {},
      note: {},
    }
  })

  const v$ = useVuelidate(rules, state)
  const invalidForm = computed(() => v$.value.$invalid)

  watch(
    () => props.item,
    (val) => {
      if (!val) return null
      state.value = val
    },
    { deep: true, immediate: true }
  )

  return {
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
