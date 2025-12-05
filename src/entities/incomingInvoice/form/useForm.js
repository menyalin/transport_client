import { computed, ref, watch, getCurrentInstance, nextTick } from 'vue'
import { required } from '@vuelidate/validators'
import { useVuelidate } from '@vuelidate/core'
import router from '@/router'
import store from '@/store/index'

export const useForm = (props, ctx, hasOrders) => {
  const { proxy } = getCurrentInstance()
  const payDateDialog = ref(false)
  const payDateFieldData = ref(null)
  const initialState = ref({
    number: null,
    date: null,
    receiptDate: null,
    payDate: null,
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
    receiptDate: {},
    payDate: {},
  }

  const state = ref(props.item?._id ? props.item : initialState.value)
  const v$ = useVuelidate(rules, state)
  const formState = computed(() => {
    return {
      ...state.value,
      company: store.getters.directoriesProfile,
    }
  })

  const allowToChangeStatus = computed(() => {
    if (state.value.status !== 'paid' || proxy.$store.getters.hasPermission('changeIncomingInvoiceStatus')) return true

    return false
  })

  const isVisiblePayDateField = computed(() => {
    return !!state.value.payDate && hasOrders.value
  })

  const isVisiblePayInvoiceBtn = computed(() => {
    return !isVisiblePayDateField.value && state.value.status === 'toPay' && hasOrders.value
  })

  function savePayDateHandler() {
    if (payDateFieldData.value) ctx.emit('savePayDate', payDateFieldData.value)
    payDateDialog.value = false
  }

  const invalidForm = computed(() => v$.value.$invalid)

  const allowedToChangeOrders = computed(() => {
    return state.value.status === 'preparing'
  })

  function statusChangeHandler(val) {
    nextTick(() => {
      if (val !== 'paid') {
        state.value = { ...state.value, payDate: null }
      }
    })
  }

  function payInvoiceHandler() {
    payDateDialog.value = true
  }

  function cancelHandler() {
    router.go(-1)
  }

  function saveHandler() {
    ctx.emit('save', formState.value)
  }

  function submitHandler() {
    ctx.emit('submit', formState.value)
  }
  function setFormState(newState) {
    state.value = {
      ...newState,
    }
  }

  watch(
    () => props.item,
    item => {
      if (!item) return
      setFormState(item)
    },
    { deep: true }
  )
  return {
    state,
    payDateFieldData,
    v$,
    isVisiblePayInvoiceBtn,
    submitHandler,
    cancelHandler,
    saveHandler,
    allowToChangeStatus,
    isVisiblePayDateField,
    invalidForm,
    allowedToChangeOrders,
    payInvoiceHandler,
    payDateDialog,
    savePayDateHandler,
    statusChangeHandler,
  }
}
