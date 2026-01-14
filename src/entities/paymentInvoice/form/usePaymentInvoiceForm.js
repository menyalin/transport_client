import dayjs from 'dayjs'
import { computed, nextTick, onMounted, ref } from 'vue'
import { required } from '@vuelidate/validators'
import { useVuelidate } from '@vuelidate/core'
import { AgreementService } from '@/shared/services/index'
import store from '@/store/index'

const getInitialState = (editedItem) => {
  const prepareDate = (date) => (date ? dayjs(date).format('YYYY-MM-DD') : null)

  return {
    status: editedItem?.status || 'inProcess',
    number: editedItem?.number || null,
    client: editedItem?.client || undefined,
    agreement: editedItem?.agreementId || undefined,
    numberByClient: editedItem?.numberByClient || undefined,
    ordersCount: editedItem.ordersCount || 0,
    note: editedItem?.note || null,
    date: prepareDate(editedItem?.date),
    plannedPayDate: prepareDate(editedItem?.plannedPayDate),
    payDate: prepareDate(editedItem?.payDate),
    sendDate: prepareDate(editedItem?.sendDate),
    dateByClient: prepareDate(editedItem?.dateByClient),
  }
}

function usePaimentInvoiceForm(props, ctx) {
  let state = ref({})
  const agreements = ref([])
  const agreementItems = computed(() => agreements.value || [])

  async function setAgreements(client) {
    if (!client) {
      state.value = { ...state.value, agreement: null }
      return
    }
    agreements.value = await AgreementService.getByClient(client)
    if (agreements.value.length === 1)
      state.value = { ...state.value, agreement: agreements.value[0]._id }
  }

  const rules = {
    number: { required },
    date: { required },
    sendDate: {},
    plannedPayDate: {},
    payDate: {},
    numberByClient: {},
    dateByClient: {},
    client: { required },
    status: { required },
    agreement: { required },
    note: {},
  }

  const v$ = useVuelidate(rules, state)

  const clientErrorMessages = computed(() => {
    const errors = []
    const clientField = v$.value.client
    if (!clientField.$invalid) return errors

    clientField.$dirty &&
      clientField.required.$invalid &&
      errors.push('Реквизит не может быть пустым')
    return errors
  })

  const agreementErrorMessages = computed(() => {
    const errors = []
    const field = v$.value.agreement
    if (!field?.$invalid) return errors

    field.$dirty &&
      field.required.$invalid &&
      errors.push('Соглашение не может быть пустым')
    return errors
  })

  const invalidForm = computed(() => v$.value.$invalid)

  async function setFormState(item) {
    state.value = getInitialState(item)
    // if (item.client) await setAgreements(item.client)
  }

  const changeClientHandler = async (val) => {
    await setAgreements(val)
  }

  const commission = computed(() => {
    if (!state.value.agreement || agreements.value.length === 0) return 0
    const { commission } = agreements.value.find(
      (i) => i._id === state.value.agreement
    )
    return commission || 0
  })

  const loaderPath = computed(() => {
    if (!state.value.client) return null
    else return store.getters.partnersMap.get(state.value.client)?.invoiceLoader
  })

  const showDateDialog = ref(false)
  const dialogDateName = ref(null)
  const dialogFieldData = ref(null)

  const dateDialogTitle = computed(() => {
    switch (dialogDateName.value) {
      case 'sendDate':
        return 'Дата оправки'
      case 'payDate':
        return 'Дата оплаты'
      default:
        return ''
    }
  })
  const hasOrders = computed(() => (state.value.ordersCount || 0) > 0)
  const isActDateDisabled = computed(() => hasOrders.value)
  const showAcceptedInvoiceBtn = computed(() => state.value.status === 'sended')

  function acceptInvoiceBtnHandler() {
    ctx.emit('save', { ...state.value, status: 'accepted' })
  }

  const showPaidInvoiceBtn = computed(() => state.value.status === 'accepted')

  function paidInvoiceBtnHandler() {
    dialogDateName.value = 'payDate'
    dialogFieldData.value = dayjs().format('YYYY-MM-DD')

    showDateDialog.value = true
  }

  const showSendInvoiceBtn = computed(
    () =>
      hasOrders.value &&
      ['inProcess', 'prepared'].includes(state.value.status) &&
      !invalidForm.value &&
      !!props?._id
  )

  function cancelDialog() {
    showDateDialog.value = false
    nextTick(() => {
      dialogFieldData.value = null
      dialogDateName.value = null
    })
  }

  function sendInvoiceBtnHandler(dateFieldName = 'sendDate') {
    dialogDateName.value = dateFieldName
    dialogFieldData.value = dayjs().format('YYYY-MM-DD')

    showDateDialog.value = true
  }

  function saveDialogDataHandler() {
    ctx.emit('setDate', {
      dateFieldName: dialogDateName.value,
      value: dialogFieldData.value,
    })
    cancelDialog()
  }

  function changeStatusHandler(newStatus) {
    if (['inProcess', 'prepared'].includes(newStatus)) {
      state.value.sendDate = null
      state.value.payDate = null
    } else if (newStatus === 'accepted') {
      state.value.payDate = null
    }
  }

  onMounted(async () => {
    if (state.value.client) await setAgreements(state.value.client)
  })

  return {
    v$,
    state,
    invalidForm,
    clientErrorMessages,
    agreementErrorMessages,
    setFormState,
    agreementItems,
    changeClientHandler,
    commission,
    loaderPath,
    showSendInvoiceBtn,
    sendInvoiceBtnHandler,
    showDateDialog,
    dateDialogTitle,
    cancelDialog,
    dialogFieldData,
    saveDialogDataHandler,
    changeStatusHandler,
    showAcceptedInvoiceBtn,
    acceptInvoiceBtnHandler,
    showPaidInvoiceBtn,
    paidInvoiceBtnHandler,
    isActDateDisabled,
  }
}

export default usePaimentInvoiceForm
