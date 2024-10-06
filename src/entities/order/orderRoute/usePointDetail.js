import { ref, computed, watch } from 'vue'
import { isLaterThan } from '@/modules/common/helpers/dateValidators'
import { useVuelidate } from '@vuelidate/core'
import store from '@/store'
import { usePersistedFormState } from '@/shared/hooks/usePersistedFormState'

export const usePointDetail = (props, ctx, addressActions) => {
  const formScope = 'route_point_' + props.ind
  const { savedForm, saveForm, formId } = usePersistedFormState()
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
    isMainLoadingPoint: null,
  }

  const getState = (point, initialState) => {
    if (savedForm(formScope)) return JSON.parse(savedForm(formScope))
    else return point ? point : initialState
  }

  const state = ref(getState(props.point, initialState))
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
    const contacts = store.getters.addressMap.get(state.value.address)?.contacts
    return contacts ? `Контакты: ${contacts}` : null
  })
  const pointTypes = computed(() => store.getters.pointTypes)
  const addressItems = computed(() =>
    store.getters.addressesForAutocomplete.filter(addressFilter)
  )
  const departureDateErrors = computed(() => {
    let errors = []
    if (v$.value.departureDate.isLaterThan.$invalid)
      errors.push('Дата не корректна')
    return errors
  })
  const isShowDocDates = computed(() => {
    return store.getters.hasPermission('order:showDocDates')
  })
  const readonlyDocDates = computed(() => {
    return !store.getters.hasPermission('order:writeDocDates')
  })
  // #endregion
  watch(
    () => props.point,
    (val) => (state.value = val),
    { deep: true }
  )
  function setField(val, field) {
    const DATE_FIELDS = [
      'plannedDate',
      'arrivalDate',
      'departureDate',
      'intervalEndDate',
    ]
    state.value[field] = val
    if (DATE_FIELDS.includes(field)) state.value[field + 'Doc'] = val
    if (['arrivalDate', 'departureDate'].includes(field))
      state.value.isAutofilled = false

    ctx.emit('changePoint', state.value)
  }
  function editAddressHandler(val) {
    saveForm(formId.value, formScope, JSON.stringify(state.value))
    addressActions.update({
      id: val.value,
      query: {
        prevFormId: formId.value,
        scope: formScope,
        field: 'address',
      },
    })
  }
  function createAddressHandler() {
    saveForm(formId.value, formScope, JSON.stringify(state.value))
    addressActions.create({
      query: {
        prevFormId: formId.value,
        scope: formScope,
        field: 'address',
      },
    })
  }
  return {
    state,
    departureDateErrors,
    isShowDocDates,
    readonlyDocDates,
    pointTypes,
    addressItems,
    setField,
    createAddressHandler,
    editAddressHandler,
    addressContactsHint,
  }
}
