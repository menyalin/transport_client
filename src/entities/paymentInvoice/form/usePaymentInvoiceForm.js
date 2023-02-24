import { computed, ref } from 'vue'
import { required } from '@vuelidate/validators'
import { useVuelidate } from '@vuelidate/core'

const getInitialState = (editedItem) => ({
  status: editedItem?.status || 'inProcess',
  number: editedItem?.number || null,
  client: editedItem?.client || null,
  agremeent: editedItem?.agremeent || null,
  note: editedItem?.note || null,
})

function usePaimentInvoiceForm() {
  let state = ref({})

  const rules = {
    number: {},
    client: { required },
    status: { required },
    agremeent: {},
    note: {},
  }

  const v$ = useVuelidate(rules, state)

  const clientErrorMessages = computed(() => {
    const err = []
    const clientField = v$.value.client
    if (!clientField.$invalid) return err

    clientField.$dirty &&
      clientField.required.$invalid &&
      err.push('Реквизит не может быть пустым')
    return err
  })

  const invalidForm = computed(() => v$.value.$invalid)

  function setFormState(item) {
    state.value = { ...getInitialState(item) }
  }

  return {
    v$,
    state,
    invalidForm,
    clientErrorMessages,
    setFormState,
  }
}

export default usePaimentInvoiceForm
