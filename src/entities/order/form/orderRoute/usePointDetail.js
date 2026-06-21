import { ref, computed, watch } from 'vue'
import { isLaterThan } from '@/modules/common/helpers/dateValidators'
import { useVuelidate } from '@vuelidate/core'
import { useAddressStore } from '@/entities/address'
import store from '@/store'

export const usePointDetail = ({ modelRef, emit, ind: _ind }) => {
  const addressStore = useAddressStore()

  const initialState = {
    type: null,
    waybills: null,
    address: null,
    isReturn: false,
    isPltReturn: false,
    isAutofilled: false,
    useInterval: false,
    plannedDate: null,
    intervalEndDate: null,
    intervalEndDateDoc: null,
    arrivalDate: null,
    departureDate: null,
    plannedDateDoc: null,
    arrivalDateDoc: null,
    departureDateDoc: null,
    waitsForWaybills: false,
    note: null,
    fixedTime: null,
    isMainLoadingPoint: false,
  }

  const state = ref(modelRef.value ? { ...modelRef.value } : { ...initialState })

  const rules = {
    departureDate: {
      isLaterThan: isLaterThan(state.value.arrivalDate),
    },
  }
  const v$ = useVuelidate(rules, state)
  function addressFilter(item) {
    if (!state.value.type) return true
    return item[state.value.type]
  }
  // #region computeds
  const addressContactsHint = computed(() => {
    if (!state.value.address) return null
    const contacts = addressStore.addressMap.get(state.value.address)?.contacts
    return contacts ? `Контакты: ${contacts}` : null
  })
  const pointTypes = computed(() => store.getters.pointTypes)
  const addressItems = computed(() => addressStore.addressesForAutocomplete.filter(addressFilter))
  const departureDateErrors = computed(() => {
    let errors = []
    if (v$.value.departureDate.isLaterThan.$invalid) errors.push('Дата не корректна')
    return errors
  })
  const isShowDocDates = computed(() => {
    return store.getters.hasPermission('order:showDocDates')
  })
  const readonlyDocDates = computed(() => {
    return !store.getters.hasPermission('order:writeDocDates')
  })
  // #endregion

  watch(modelRef, (val) => (state.value = val), { deep: true })
  function setField(val, field) {
    const DATE_FIELDS = ['plannedDate', 'arrivalDate', 'departureDate', 'intervalEndDate']
    state.value[field] = val
    if (DATE_FIELDS.includes(field)) state.value[field + 'Doc'] = val
    if (['arrivalDate', 'departureDate'].includes(field)) state.value.isAutofilled = false

    modelRef.value = { ...state.value }
    if (field === 'isMainLoadingPoint') emit('changePoint', { ...state.value })
  }
  return {
    state,
    departureDateErrors,
    isShowDocDates,
    readonlyDocDates,
    pointTypes,
    addressItems,
    setField,
    addressContactsHint,
  }
}
