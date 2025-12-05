import { ref, computed } from 'vue'
import { useVuelidate } from '@vuelidate/core'
import { isLaterThan } from '@/modules/common/helpers/dateValidators.js'
import { required } from '@vuelidate/validators'
import { usePersistedFormState } from '@/shared/hooks/usePersistedFormState'
import store from '@/store'

export const useForm = (props, ctx) => {
  const formScope = 'root'
  const { formId, getState, clearStoredForm, saveForm } = usePersistedFormState()
  const initialState = {
    title: null,
    truck: null,
    type: null,
    note: null,
    partner: null,
    address: null,
    startPositionDate: null,
    endPositionDate: null,
    inOrderTime: false,
  }

  const state = ref(getState(formScope, props.downtime, initialState))

  const rules = {
    title: { required },
    truck: { required },
    type: { required },
    note: {},
    startPositionDate: { required },
    endPositionDate: {
      required,
      isLaterThan: isLaterThan(state.value.startPositionDate),
    },
  }

  const v$ = useVuelidate(rules, state)

  //#region computed
  const isInvalidForm = computed(() => v$.value.$invalid)

  const truckItems = computed(() =>
    store.getters.trucks.filter(item => item.type === 'truck').map(item => ({ value: item._id, text: item.regNum }))
  )
  const partnerContactsHint = computed(() => {
    if (!state.value.partner) return null
    const partner = store.getters.partnersMap.get(state.value.partner)
    if (!partner) return null
    return partner.contacts
  })
  const downtimeTypes = computed(() => store.getters.downtimeTypes)

  const serviceAdressItems = computed(() => store.getters.addressesForAutocomplete.filter(i => i.service))

  const serviceItems = computed(() =>
    store.getters.partners.filter(i => i.isService).map(i => ({ value: i._id, text: i.name }))
  )
  //#endregion

  function resetForm() {
    clearStoredForm(formScope)
    state.value = initialState
  }

  function submit() {
    ctx.emit('submit', {
      ...state.value,
      company: store.getters.directoriesProfile,
    })
    resetForm()
  }

  function cancel() {
    resetForm()
    ctx.emit('cancel')
  }

  const createAddressHandler = () => {
    saveForm(formId.value, formScope, JSON.stringify(state.value))
    props.addressActions.create({
      query: { prevFormId: formId.value, field: 'address', scope: formScope },
    })
  }

  const updateAddressHandler = address => {
    saveForm(formId.value, formScope, JSON.stringify(state.value))
    props.addressActions.update({
      id: address.value,
      query: { prevFormId: formId.value, field: 'address', scope: formScope },
    })
  }

  const createPartnerHandler = () => {
    saveForm(formId.value, formScope, JSON.stringify(state.value))
    props.partnerActions.create({
      query: { prevFormId: formId.value, field: 'partner', scope: formScope },
    })
  }

  const updatePartnerHandler = item => {
    saveForm(formId.value, formScope, JSON.stringify(state.value))
    props.partnerActions.update({
      id: item.value,
      query: { prevFormId: formId.value, field: 'partner', scope: formScope },
    })
  }

  return {
    state,
    isInvalidForm,
    resetForm,
    submit,
    cancel,
    truckItems,
    serviceAdressItems,
    serviceItems,
    downtimeTypes,
    createAddressHandler,
    updateAddressHandler,
    createPartnerHandler,
    updatePartnerHandler,
    partnerContactsHint,
  }
}
