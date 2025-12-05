import { computed, onMounted, ref } from 'vue'
import store from '@/store'
import { required } from '@vuelidate/validators'
import { useVuelidate } from '@vuelidate/core'
import { AgreementService } from '@/shared/services/index'

const getInitialState = editedItem => ({
  number: editedItem?.number || null,
  client: editedItem?.client || null,
  agreement: editedItem?.agreement || null,
  status: editedItem?.status || 'inProcess',
  placeForTransferDocs: editedItem?.placeForTransferDocs || null,
  note: editedItem?.note || null,
})

function useDocsRegistryForm() {
  let state = ref({})
  const allAgreements = ref([])

  onMounted(async () => {
    allAgreements.value = await getAllAgreements()
  })

  const rules = {
    client: { required },
    status: { required },
    agreement: { required },
    placeForTransferDocs: { required },
    note: {},
  }

  const v$ = useVuelidate(rules, state)

  const clientErrorMessages = computed(() => {
    const err = []
    const clientField = v$.value.client
    if (!clientField.$invalid) return err

    clientField.$dirty && clientField.required.$invalid && err.push('Реквизит не может быть пустым')
    return err
  })

  const placeErrorMessages = computed(() => {
    const err = []
    const field = v$.value.placeForTransferDocs
    if (!field.$invalid) return err

    field.$dirty && field.required.$invalid && err.push('Площадка не может быть пустой')
    return err
  })

  const agreementErrorMessages = computed(() => {
    const err = []
    const field = v$.value.agreement
    if (!field.$invalid) return err

    field.$dirty && field.required.$invalid && err.push('Соглашение не может быть пустым')
    return err
  })

  const disabledAgreements = computed(() => {
    return !state.value.client
  })
  const loadingAgreements = computed(() => {
    return false
  })

  const agreementItems = computed(() => {
    return allAgreements.value.filter(i => i.clients.includes(state.value.client)).map(i => ({ ...i, value: i._id }))
  })

  function changeAgreementHandler(value) {
    console.log('change agreement handler: ', value)
  }

  const invalidForm = computed(() => v$.value.$invalid)

  function setFormState(item) {
    state.value = { ...getInitialState(item) }
  }

  async function getAllAgreements() {
    const { items } = await AgreementService.getList({
      company: store.getters.directoriesProfile,
      limit: 100,
      skip: 0,
      clientsOnly: true,
    })
    return items
  }

  return {
    v$,
    state,
    invalidForm,
    clientErrorMessages,
    setFormState,
    placeErrorMessages,
    disabledAgreements,
    loadingAgreements,
    agreementItems,
    agreementErrorMessages,
    changeAgreementHandler,
  }
}

export default useDocsRegistryForm
