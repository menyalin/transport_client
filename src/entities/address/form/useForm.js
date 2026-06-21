import store from '@/store'
import { ref, computed } from 'vue'
import useVuelidate from '@vuelidate/core'
import { required } from '@vuelidate/validators'

export const useForm = (props, ctx) => {
  const validCoordinates = (val) => {
    if (!val) return true
    const arr = val.split(',')
    return arr.length === 2 && +arr[0] >= -90 && +arr[0] <= 90 && +arr[1] >= -180 && +arr[1] <= 180
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

  const state = ref(props.address ? { ...props.address } : { ...initialState })

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

  function resetForm() {
    state.value = { ...initialState }
  }

  function submit() {
    const address = {
      ...state.value,
      company: store.getters.directoriesProfile,
    }
    ctx.emit('submit', address)
    resetForm()
  }

  function cancel() {
    ctx.emit('cancel')
    resetForm()
  }

  function getParsedAddress(val) {
    if (!val) return
    state.value.name = val.value
    if (val.geo) {
      state.value.geo = val.geo
    } else if (val.data.geo_lat && val.data.geo_lon) {
      state.value.geo = `${val.data.geo_lat}, ${val.data.geo_lon}`
    }
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
  }
}
