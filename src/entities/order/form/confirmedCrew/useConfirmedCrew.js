import { computed, ref, getCurrentInstance, watch } from 'vue'
import { CrewService, AgreementService } from '@/shared/services'
import putCrewDataToClipboard from './putCrewDataToClipboard'
export const useConfirmedCrew = (props, ctx) => {
  const { proxy } = getCurrentInstance()
  const initialState = {
    truck: null,
    trailer: null,
    driver: null,
    outsourceAgreement: null,
    tkName: null,
  }
  const state = ref(props.crew ? props.crew : initialState)
  const loading = ref(false)
  const crewEmptyError = ref(false)
  const outsourceAgreement = ref(null)
  // #region computeds
  const showOutsourceAgreementRow = computed(
    () =>
      state.value.truck &&
      proxy.$store.getters.outsourceTruckIds.includes(state.value.truck)
  )

  const tkName = computed(
    () =>
      proxy.$store.getters.trucksMap.get(state.value.truck)?.tkName?.name || '-'
  )

  const outsourceAgreementName = computed(() => outsourceAgreement.value?.name)
  const trucks = computed(() =>
    proxy.$store.getters.trucks
      .filter((item) => item.type === 'truck')
      .map((item) => ({ value: item._id, text: item.regNum }))
  )

  const drivers = computed(() =>
    proxy.$store.getters.drivers.map((item) => ({
      value: item._id,
      text: item.fullName,
    }))
  )

  const trailers = computed(() =>
    proxy.$store.getters.trucks
      .filter((item) => item.type === 'trailer')
      .map((item) => ({ value: item._id, text: item.regNum }))
  )

  const hasTruck = computed(() => Boolean(state.value.truck))
  const isOutsourceTruck = computed(
    () =>
      state.value.truck &&
      proxy.$store.getters.outsourceTruckIds.includes(state.value.truck)
  )
  const isNeedUpdateCrew = computed(
    () => props.date && state.value.truck && !props.confirmed
  )

  const truckReadOnly = computed(
    () =>
      props.confirmed &&
      !proxy.$store.getters.hasPermission('fake permission. only for admin!')
  )
  // #endregion

  function setState(val) {
    ctx.emit('change', val)
  }

  function resetState() {
    crewEmptyError.value = false
    outsourceAgreement.value = null
    setState(initialState)
  }

  async function getCrew() {
    if (isNeedUpdateCrew.value) {
      try {
        loading.value = true
        const truck = proxy.$store.getters.trucksMap.get(state.value.truck)
        const tkNameId = truck?.tkName?._id || truck?.tkName || null
        const crew = await CrewService.getCrewByTruckAndDate({
          truck: state.value.truck,
          date: props.date,
        })
        crewEmptyError.value = !crew
        if (isOutsourceTruck.value && tkNameId) {
          outsourceAgreement.value = await AgreementService.getForOrder({
            company: proxy.$store.getters.directoriesProfile,
            date: props.date,
            tkNameId,
          })
        }

        setState({
          truck: state.value.truck,
          trailer: crew?.transport?.trailer || null,
          driver: crew?.driver || null,
          tkName: tkNameId,
          outsourceAgreement: outsourceAgreement.value?._id || null,
        })
      } finally {
        loading.value = false
      }
    }
  }

  async function changeTruckHandler(val) {
    if (!val) resetState()
    else {
      state.value.truck = val
      await getCrew()
    }
  }

  function copyHandler() {
    if (!state.value.truck || !state.value.driver) return null

    const truck = proxy.$store.getters.trucksMap.get(state.value.truck)
    const driver = proxy.$store.getters.driversMap.get(state.value.driver)
    const trailer = state.value.trailer
      ? proxy.$store.getters.trucksMap.get(state.value.trailer)
      : {}
    putCrewDataToClipboard({ truck, driver, trailer })
  }
  watch(crewEmptyError, (val) => {
    if (val) {
      outsourceAgreement.value = null
      state.value.outsourceAgreement = null
      state.value.tkName = null
    }
  })

  watch(
    () => props.crew,
    (val) => (state.value = { ...val }),
    { deep: true, immediate: true }
  )

  watch(
    () => props.date,
    async () => await getCrew(),
    { immediate: true }
  )

  return {
    state,
    loading,
    outsourceAgreement,
    showOutsourceAgreementRow,
    tkName,
    outsourceAgreementName,
    trucks,
    drivers,
    trailers,
    hasTruck,
    isOutsourceTruck,
    changeTruckHandler,
    copyHandler,
    truckReadOnly,
    crewEmptyError,
  }
}
