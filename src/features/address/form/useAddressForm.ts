import { ref, computed, watch, onMounted, type Ref } from 'vue'
import { useRoute } from 'vue-router'
import useVuelidate from '@vuelidate/core'
import { required } from '@vuelidate/validators'
import { useStore } from 'vuex'
import { useZoneStore } from '@/entities/zone/zoneStore'
import { useFormDraft } from '@/shared/composables/useFormDraft'

export interface AddressFormData {
  _id?: string
  name?: string | null
  region?: string | null
  city?: string | null
  geo?: string | null
  shortName?: string | null
  note?: string | null
  isShipmentPlace?: boolean
  isDeliveryPlace?: boolean
  isService?: boolean
  partner?: string | null
  zones?: string[]
  contacts?: string | null
  company?: string | null
  [key: string]: any
}

export interface AddressFormState extends Required<AddressFormData> {
  name: string | null
  region: string | null
  city: string | null
  geo: string | null
  shortName: string | null
  note: string | null
  isShipmentPlace: boolean
  isDeliveryPlace: boolean
  isService: boolean
  partner: string | null
  zones: string[]
  contacts: string | null
  company: string | null
}

export interface AddressFormProps {
  address?: AddressFormData
  displayDeleteBtn?: boolean
  formName?: string
  partnerItems?: any[]
  isDraftEnabled?: boolean
}

export function useForm(props: AddressFormProps, emit: (...args: any[]) => void) {
  const vuexStore = useStore()
  const zoneStore = useZoneStore()
  const route = useRoute()

  const validCoordinates = (val: string | null) => {
    if (!val) return true
    const arr = val.split(',')
    return arr.length === 2 && +arr[0] >= -90 && +arr[0] <= 90 && +arr[1] >= -180 && +arr[1] <= 180
  }

  const initialState: AddressFormState = {
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
    company: null,
  }

  const state: Ref<AddressFormState> = ref(
    props.address ? { ...initialState, ...props.address } : { ...initialState }
  )

  const draftEnabled = computed(() => props.isDraftEnabled)
  const { clearDraft } = useFormDraft({ key: 'address-form-draft', state, enabled: draftEnabled })

  const rules = {
    name: { required },
    geo: { required, validCoordinates },
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
    const errors: string[] = []
    if (v$.value.name.$dirty && v$.value.name.$invalid) {
      errors.push('Наименование адреса не может быть пустым')
    }
    return errors
  })

  const geoErrors = computed(() => {
    const errors: string[] = []
    if (!v$.value.geo.$dirty) return errors
    if (v$.value.geo.required?.$invalid) {
      errors.push('Координаты обязательны для заполнения')
    } else if (v$.value.geo.validCoordinates?.$invalid) {
      errors.push('Некорректные координаты. Пример: 55.7558, 37.6173')
    }
    return errors
  })

  function resetForm() {
    state.value = { ...initialState }
  }

  function submit() {
    const address = {
      ...state.value,
      company: vuexStore.getters.directoriesProfile,
    }
    emit('submit', address)
    resetForm()
    clearDraft()
  }

  function cancel() {
    emit('cancel')
    resetForm()
    clearDraft()
  }

  function getParsedAddress(
    val: {
      value: string
      geo?: string
      data?: { geo_lat?: string; geo_lon?: string }
    } | null
  ) {
    console.log('parsed value: ', val)
    if (!val) return
    state.value.name = val.value
    if (val.geo) {
      state.value.geo = val.geo
    } else if (val.data?.geo_lat && val.data?.geo_lon) {
      state.value.geo = `${val.data.geo_lat}, ${val.data.geo_lon}`
    }
  }

  onMounted(() => {
    if (!draftEnabled.value) return
    const { newRegionId, newCityId, clearedRegion, clearedCity } = route.query
    if (newRegionId) state.value.region = newRegionId as string
    if (clearedRegion) state.value.region = null
    if (newCityId) state.value.city = newCityId as string
    if (clearedCity) state.value.city = null
  })

  watch(
    () => props.address,
    (val) => {
      state.value = { ...initialState, ...(val || {}) }
    },
    { deep: true }
  )

  return {
    state,
    v$,
    zoneItems: computed(() => zoneStore.zonesForAutocomplete),
    nameErrors,
    geoErrors,
    resetForm,
    submit,
    cancel,
    getParsedAddress,
  }
}
