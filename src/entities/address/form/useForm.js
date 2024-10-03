import store from '@/store'
import { ref, computed } from 'vue'
import useVuelidate from '@vuelidate/core'
import { required } from '@vuelidate/validators'
import { usePersistedFormState } from '@/shared/hooks/usePersistedFormState'

export const useForm = (props, ctx) => {
  const formScope = 'root'
  const { formId, saveForm, savedForm } = usePersistedFormState()

  const validCoordinates = (val) => {
    if (!val) return true
    const arr = val.split(',')
    return (
      arr.length === 2 &&
      +arr[0] >= -90 &&
      +arr[0] <= 90 &&
      +arr[1] >= -180 &&
      +arr[1] <= 180
    )
  }
  const initialState = {
    name: null,
    region: null,
    city: null,
    geo: null,
    shortName: null,
    note: null,
    isShipmentPlace: false,
    isDeliveryPlace: false,
    isService: false,
    partner: null,
    zones: [],
    contacts: null,
  }

  const getState = (address, initialState) => {
    if (savedForm(formScope)) return JSON.parse(savedForm(formScope))
    else return address ? address : initialState
  }

  const state = ref({ ...getState(props.address, initialState) })

  const rules = {
    name: { required },
    geo: { validCoordinates },
    region: {},
    city: {},
    partner: {},
    zones: {},
    contacts: {},
    isShipmentPlace: {},
    isDeliveryPlace: {},
    isService: {},
    note: {},
    shortName: {},
  }
  const v$ = useVuelidate(rules, state)
  const nameErrors = computed(() => {
    const errors = []
    if (v$.value.name.$dirty && v$.value.name.$invalid) {
      errors.push('Наименование адреса не может быть пустым')
    }
    return errors
  })

  const geoErrors = computed(() => {
    const errors = []
    if (v$.value.geo.$dirty && v$.value.geo.$invalid) {
      errors.push('Введенные координаты не корректны')
    }
    return errors
  })
  const resetForm = () => {
    sessionStorage.removeItem(props.formId)
    state.value = initialState
  }
  const submit = () => {
    const address = {
      ...state.value,
      company: store.getters.directoriesProfile,
    }
    ctx.emit('submit', address)
    resetForm()
  }

  const cancel = () => {
    ctx.emit('cancel')
    resetForm()
  }

  const getParsedAddress = (val) => {
    if (!val) return
    else {
      state.value.name = val.value
      if (val.geo) {
        state.value.geo = val.geo
      } else if (val.data.geo_lat && val.data.geo_lon) {
        state.value.geo = `${val.data.geo_lat}, ${val.data.geo_lon}`
      }
    }
  }

  const createPartnerHandler = () => {
    saveForm(formId.value, formScope, JSON.stringify(state.value))
    props.partnerActions.create({
      query: { prevFormId: formId.value, field: 'partner', scope: formScope },
    })
  }

  const updatePartnerHandler = (partner) => {
    saveForm(formId.value, formScope, JSON.stringify(state.value))
    props.partnerActions.update({
      id: partner._id,
      query: { prevFormId: formId.value, field: 'partner', scope: formScope },
    })
  }
  return {
    state,
    v$,
    nameErrors,
    geoErrors,
    resetForm,
    submit,
    cancel,
    getParsedAddress,
    createPartnerHandler,
    updatePartnerHandler,
  }
}
