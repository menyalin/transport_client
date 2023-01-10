import { useVuelidate } from '@vuelidate/core'
import { required } from '@vuelidate/validators'
import { computed, ref } from 'vue'

const getInitialState = (editedItem) => ({
  number: editedItem?.number || null,
  client: editedItem?.client || null,
  status: editedItem?.status || 'inProcess',
  placeForTransferDocs: editedItem?.placeForTransferDocs || null,
  note: editedItem?.note || null,
})

function useDocsRegistryForm() {
  let state = ref({})

  const rules = {
    client: { required },
    status: { required },
    placeForTransferDocs: { required },
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

  const placeErrorMessages = computed(() => {
    const err = []
    const field = v$.value.placeForTransferDocs
    if (!field.$invalid) return err

    field.$dirty &&
      field.required.$invalid &&
      err.push('Площадка не может быть пустой')
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
    placeErrorMessages,
  }
}

export default useDocsRegistryForm
