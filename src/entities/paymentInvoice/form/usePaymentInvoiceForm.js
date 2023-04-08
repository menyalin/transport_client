import dayjs from 'dayjs'
import { computed, ref } from 'vue'
import { required } from '@vuelidate/validators'
import { useVuelidate } from '@vuelidate/core'
import { AgreementService } from '@/shared/services/index'

const getInitialState = (editedItem) => ({
  status: editedItem?.status || 'inProcess',
  number: editedItem?.number || null,
  client: editedItem?.client || undefined,
  agreement: editedItem?.agreement || null,
  note: editedItem?.note || null,
  sendDate: editedItem?.sendDate
    ? dayjs(editedItem?.sendDate).format('YYYY-MM-DD')
    : null,
})

function usePaimentInvoiceForm() {
  let state = ref({})
  const agreements = ref([])
  const agreementItems = computed(() => agreements.value || [])

  async function setAgreements(client) {
    if (!client) return null
    agreements.value = await AgreementService.getByClient(client)
    if (agreements.value.length === 1)
      state.value = { ...state.value, agreement: agreements.value[0]._id }
  }

  const rules = {
    number: {},
    sendDate: {},
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
    if (item.client) await setAgreements(item.client)
  }

  const changeClientHandler = async (val) => {
    // state.value = { ...state.value, agreement: null }
    if (val) await setAgreements(val)
  }

  return {
    v$,
    state,
    invalidForm,
    clientErrorMessages,
    agreementErrorMessages,
    setFormState,
    agreementItems,
    changeClientHandler,
  }
}

export default usePaimentInvoiceForm
