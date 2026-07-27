import { ref, computed } from 'vue'
import { useVuelidate } from '@vuelidate/core'
import { isLaterThan } from '@/shared/utils/dateValidators'
import { required } from '@vuelidate/validators'
import { useAddressStore } from '@/entities/address'
import store from '@/store'

export const useForm = (props, emit) => {
  const addressStore = useAddressStore()

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

  const state = ref(props.downtime ? { ...props.downtime } : { ...initialState })

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

  const isInvalidForm = computed(() => v$.value.$invalid)

  const truckItems = computed(() =>
    store.getters.trucks
      .filter((item) => item.type === 'truck')
      .map((item) => ({ value: item._id, text: item.regNum }))
  )
  const partnerContactsHint = computed(() => {
    if (!state.value.partner) return null
    const partner = store.getters.partnersMap.get(state.value.partner)
    if (!partner) return null
    return partner.contacts
  })
  const downtimeTypes = computed(() => store.getters.downtimeTypes)

  const serviceAdressItems = computed(() =>
    addressStore.addressesForAutocomplete.filter((i) => i.service)
  )

  const serviceItems = computed(() =>
    store.getters.partners.filter((i) => i.isService).map((i) => ({ value: i._id, text: i.name }))
  )

  function resetForm() {
    state.value = { ...initialState }
  }

  function submit() {
    emit('submit', {
      ...state.value,
      company: store.getters.directoriesProfile,
    })
    resetForm()
  }

  function cancel() {
    resetForm()
    emit('cancel')
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
    partnerContactsHint,
  }
}
