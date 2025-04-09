import dayjs from 'dayjs'
import { getCurrentInstance, ref, computed } from 'vue'
import { isLaterThan } from '@/modules/common/helpers/dateValidators'
import { CrewService } from '@/shared/services/index'
import { useVuelidate } from '@vuelidate/core'
import { useCarriers } from '@/entities/carrier/useCarriers'
import { required, minLength } from '@vuelidate/validators'

export const useCrewForm = (props, ctx) => {
  const loading = ref(false)
  const { allCarriers } = useCarriers()
  const { proxy } = getCurrentInstance()
  const actualDriverCrew = ref(null)
  const crewId = props.crew?._id ?? null

  const crewEditable = ref(props.crew?.editable ?? false)
  const initialState = {
    tkName: null,
    onlyCarrierItems: true,
    transport: [],
    driver: null,
    startDate: null,
    endDate: null,
    note: '',
  }
  const state = ref(
    props.crew
      ? {
          onlyCarrierItems: true,
          ...props.crew,
          driver: props.crew.driver._id,
          tkName: props.crew.tkName._id,
        }
      : initialState
  )
  const minValueForStartDate = computed(() => {
    if (!actualDriverCrew.value) return '2021-08-01'
    return actualDriverCrew.value.transport.endDate
      ? actualDriverCrew.value.transport.endDate
      : actualDriverCrew.value.transport.startDate
  })

  const truckItems = computed(() => {
    if (!state.value.driver) return []

    if (state.value.onlyCarrierItems)
      return proxy.$store.getters.trucks
        .filter((t) => t.type === 'truck')
        .filter((truck) =>
          truck.allowedDrivers?.some(
            ({ driver }) => driver === state.value.driver
          )
        )
    else return proxy.$store.getters.trucks.filter((t) => t.type === 'truck')
  })

  const trailerItems = computed(() =>
    proxy.$store.getters.trucks
      .filter((t) => t.type === 'trailer')
      .filter((trailer) =>
        state.value.onlyCarrierItems
          ? trailer.tkName._id === state.value.tkName
          : true
      )
  )

  const rules = computed(() => {
    return {
      tkName: { required },
      driver: { required },
      startDate: {
        required,
        isLaterThan: isLaterThan(minValueForStartDate.value),
      },
      endDate: { isLaterThan: isLaterThan(state.value.startDate) },
      transport: { minLength: minLength(1), required },
      note: {},
      onlyCarrierItems: {},
    }
  })
  const v$ = useVuelidate(rules, state, { $scope: false })

  const changeStartDateHandler = async (val) => {
    actualDriverCrew.value = null
    if (!val || !state.value.driver) return
    loading.value = true
    try {
      actualDriverCrew.value = await CrewService.getCrewByDriverAndDate({
        driver: state.value.driver,
        date: val,
      })
    } catch (e) {
      console.error(e)
    } finally {
      loading.value = false
    }
  }

  const showTransportTable = computed(
    () =>
      state.value.startDate &&
      !v$.value.startDate.$invalid &&
      (!actualDriverCrew.value || actualDriverCrew.value?.endDate)
  )

  const startDateError = computed(() => {
    let errors = []
    if (v$.value.startDate.$dirty && !v$.value.startDate.required)
      errors.push('Поле не может быть пустым')
    if (v$.value.startDate.$dirty && !v$.value.startDate.isLaterThan) {
      const dateStr = dayjs(v$.value.startDate.$params.isLaterThan.eq).format(
        'DD.MM.YYYY HH:mm'
      )
      errors.push(`Дата должна быть больше ${dateStr}`)
    }
    return errors
  })

  const endDateError = computed(() => {
    let errors = []
    if (v$.value.endDate.isLaterThan.$invalid)
      errors.push('Дата должна быть больше начальной даты')
    return errors
  })

  const allowUseTrailers = computed(() =>
    proxy.$store.getters.allowedToUseTrailersTrucksSet.has(state.value.truck)
  )

  const resetForm = () => {
    state.value = { ...initialState }
  }

  const driverItems = computed(() => {
    return proxy.$store.getters.drivers.filter((driver) =>
      state.value.onlyCarrierItems
        ? driver.tkName._id === state.value.tkName
        : true
    )
  })

  const cancelHandler = () => {
    resetForm()
    ctx.emit('cancel')
  }

  const submitHandler = () => {
    ctx.emit('submit', {
      ...state.value,
      company: proxy.$store.getters.directoriesProfile,
    })
    resetForm()
  }

  const addTransportItemHandler = (val) => {
    const idx = state.value.transport?.length - 1
    if (idx >= 0 && !state.value.transport[idx].endDate) {
      state.value.transport[idx].endDate = val.startDate
      state.value.transport[idx].updated = true
    }
    state.value.transport.push(val)
  }

  const deleteLastItemInTransportHandler = () => {
    crewEditable.value = false
    state.value.transport.pop()
  }

  const clearActualCrewHandler = () => {
    actualDriverCrew.value = null
  }
  const deleteCrewHandler = () => {
    const res = proxy.$confirm('Вы уверены?')
    if (res) {
      ctx.emit('delete')
    }
  }

  const changeOnlyCarrierItemsHandler = () => {
    state.value.driver = null
  }

  const isReturnToWorkAllowed = computed(
    () =>
      (props.crew?.editable ?? false) &&
      state.value.endDate &&
      state.value.transport[state.value.transport.length - 1].endDate &&
      !v$.value.$invalid
  )

  const returnToWorkHandler = () => {
    state.value.endDate = null
    const lastItem = state.value.transport[state.value.transport.length - 1]
    if (lastItem) lastItem.endDate = null
  }

  const hasUnsavedChanges = computed(() => {
    if (!props.crew) return true
    const plainFields = ['onlyCarrierItems', 'startDate', 'endDate', 'note']

    const isPlainFiedsChanched = plainFields.some(
      (key) =>
        JSON.stringify(state.value[key] ?? true) !==
        JSON.stringify(props.crew[key] ?? true)
    )

    if (isPlainFiedsChanched) return true

    const isDriverChanged = state.value.driver !== props.crew.driver._id
    const isCarrierChanged = state.value.tkName !== props.crew.tkName._id

    if (isDriverChanged || isCarrierChanged) return true

    const isTransportChanged = state.value.transport.some(
      (item, idx) =>
        JSON.stringify(item) !== JSON.stringify(props.crew.transport[idx])
    )
    return isTransportChanged
  })

  const disabledSubmitForm = computed(() => {
    return (
      !proxy.$store.getters.hasPermission('crew:write') ||
      !hasUnsavedChanges.value ||
      v$.value.$invalid
    )
  })
  const disabledEndDateField = computed(() => {
    return (
      state.value.transport.length === 0 ||
      !state.startDate ||
      (!!state.endDate && !crewEditable)
    )
  })
  return {
    state,
    hasUnsavedChanges,
    crewId,
    crewEditable,
    actualDriverCrew,
    changeStartDateHandler,
    carrierItems: allCarriers,
    driverItems,
    truckItems,
    trailerItems,
    disabledSubmitForm,
    disabledEndDateField,
    startDateError,
    allowUseTrailers,
    minValueForStartDate,
    showTransportTable,
    cancelHandler,
    submitHandler,
    addTransportItemHandler,
    deleteLastItemInTransportHandler,
    clearActualCrewHandler,
    endDateError,
    deleteCrewHandler,
    changeOnlyCarrierItemsHandler,
    returnToWorkHandler,
    isReturnToWorkAllowed,
  }
}
