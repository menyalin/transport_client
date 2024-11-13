import { computed, ref, watch } from 'vue'
import { required } from '@vuelidate/validators'
import { useVuelidate } from '@vuelidate/core'
import router from '@/router'
import store from '@/store/index'
import dayjs from 'dayjs'
/*
  company: string
  number: string
  date: Date
  plannedPayDate: Date | null
  agreement: string
  status: string
  isActive: boolean
  note?: string
  orders: IncomingInvoiceOrder[] = []
*/

export const useForm = (props, ctx) => {
  const initialState = ref({
    number: null,
    date: null,
    agreement: null,
    status: 'preparing',
    plannedPayDate: null,
    note: '',
  })

  const rules = {
    number: { required },
    date: { required },
    agreement: { required },
    status: { required },
    note: {},
    plannedPayDate: {},
  }

  const state = ref(props.item?._id ? props.item : initialState.value)
  const v$ = useVuelidate(rules, state)
  const formState = computed(() => {
    return {
      ...state.value,
      date: new Date(state.value.date).toISOString(),
      plannedPayDate: state.value.plannedPayDate
        ? new Date(state.value.plannedPayDate).toISOString()
        : null,
      company: store.getters.directoriesProfile,
    }
  })

  const invalidForm = computed(() => v$.value.$invalid)

  function cancelHandler() {
    router.go(-1)
  }
  const statusItems = computed(() => {
    return [
      { text: 'Активен', value: 'active' },
      { text: 'Завершен', value: 'completed' },
      { text: 'Отменен', value: 'cancelled' },
    ]
  })

  function saveHandler() {
    ctx.emit('save', formState.value)
  }

  function submitHandler() {
    ctx.emit('submit', formState.value)
  }
  function setFormState(newState) {
    state.value = {
      ...newState,
      date: dayjs(newState.date).format('YYYY-MM-DD'),
      plannedPayDate: newState.plannedPayDate
        ? dayjs(newState.plannedPayDate).format('YYYY-MM-DD')
        : null,
    }
  }
  watch(
    () => props.item,
    (item) => {
      if (!item) return
      setFormState(item)
    },
    { deep: true }
  )
  return {
    state,
    v$,
    submitHandler,
    cancelHandler,
    saveHandler,
    statusItems,
    invalidForm,
  }
}
