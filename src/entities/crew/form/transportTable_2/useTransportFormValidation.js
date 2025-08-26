import { computed, getCurrentInstance, ref } from 'vue'
import useVuelidate from '@vuelidate/core'
import { required, requiredIf } from '@vuelidate/validators'
import { isLaterThan } from '@/modules/common/helpers/dateValidators.js'
import { CrewService } from '@/shared/services/index'

export const useTransportFormValidation = (state, props) => {
  const { proxy } = getCurrentInstance()
  const loading = ref(false)
  const existedTruckCrew = ref(null)
  const existedTrailerCrew = ref(null)

  const clearExistedCrews = () => {
    existedTruckCrew.value = null
    existedTrailerCrew.value = null
    loading.value = false
  }

  const allowUseTrailer = computed(() => {
    if (!state.value.truck) return false
    return proxy.$store.getters.allowedToUseTrailersTrucksSet.has(
      state.value.truck
    )
  })

  const hasActiveCrews = computed(
    () => existedTrailerCrew.value !== null || existedTruckCrew.value !== null
  )

  const changeTruckHandler = async (id, type) => {
    clearExistedCrews()
    if (type === 'truck') state.value.trailer = null
    if (!id) {
      return
    }
    loading.value = true
    try {
      const existedCrew = await CrewService.getActualCrewByTruck(id)
      if (!existedCrew || existedCrew._id === props.crewId) return null

      if (
        existedCrew.transport.endDate &&
        +new Date(existedCrew.transport.endDate) <=
          +new Date(state.value.startDate)
      )
        return null

      if (type === 'truck') existedTruckCrew.value = existedCrew
      else if (type === 'trailer') existedTrailerCrew.value = existedCrew
    } catch (e) {
      proxy.$store.commit('setError', e?.message || e)
    } finally {
      loading.value = false
    }
  }

  const rules = computed(() => {
    return {
      startDate: {
        required,
        isLaterThan: isLaterThan(props.minDateValue),
      },
      endDate: { isLaterThan: isLaterThan(state.value.startDate) },
      truck: { required },
      trailer: { required: requiredIf(allowUseTrailer) },
      note: {},
    }
  })

  const startDateErrors = computed(() => {
    if (!v$.value.startDate.$dirty) return []
    const errors = []
    if (v$.value.startDate.required.$invalid)
      errors.push('Поле не может быть пустым')
    if (v$.value.startDate.isLaterThan.$invalid)
      errors.push(
        'Начальная дата должна быть больше: ' +
          new Date(props.minDateValue).toLocaleString()
      )
    return errors
  })

  const endDateErrors = computed(() => {
    if (!v$.value.endDate.$dirty) return []
    const errors = []

    if (v$.value.endDate.isLaterThan.$invalid)
      errors.push(
        'Начальная дата должна быть больше: ' +
          new Date(state.value.startDate || props.minDateValue).toLocaleString()
      )
    return errors
  })

  const v$ = useVuelidate(rules, state)

  const invalidForm = computed(
    () => v$.value.$invalid || loading.value || hasActiveCrews.value
  )

  const trailerInputDisabled = computed(() => !allowUseTrailer.value)

  return {
    loading,
    changeTruckHandler,
    invalidForm,
    startDateErrors,
    endDateErrors,
    trailerInputDisabled,
    existedTruckCrew,
    existedTrailerCrew,
    clearExistedCrews,
  }
}
