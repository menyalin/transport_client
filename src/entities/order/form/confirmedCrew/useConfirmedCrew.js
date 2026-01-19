import { computed, ref, getCurrentInstance, watch } from 'vue'
import { CrewService, CarrierAgreementService } from '@/shared/services'
import putCrewDataToClipboard from './putCrewDataToClipboard'
import { carrierAgreementSelector } from './utils/carrierAgreementSelector'

export const useConfirmedCrew = (props, ctx) => {
  const { proxy } = getCurrentInstance()
  const initialState = {
    truck: null,
    trailer: null,
    driver: null,
    outsourceAgreement: null,
    tkName: null,
    directiveAgreement: false,
  }
  const state = ref(
    props.crew ? { directiveAgreement: true, ...props.crew } : initialState
  )
  const loading = ref(false)
  const crewEmptyError = ref(false)
  const allowedAgreements = ref([])
  const outsourceAgreement = ref(null)
  // #region computeds
  const showOutsourceAgreementRow = computed(() => !!outsourceAgreement.value)

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
  const executorAndCustomerMissmatch = computed(() => {
    if (!outsourceAgreement.value) return false
    return (
      props.executorIdInClientAgreement !== outsourceAgreement.value.customer
    )
  })
  const trailers = computed(() =>
    proxy.$store.getters.trucks
      .filter((item) => item.type === 'trailer')
      .map((item) => ({ value: item._id, text: item.regNum }))
  )

  const hasTruck = computed(() => Boolean(state.value.truck))

  const isNeedUpdateCrew = computed(
    () => props.date && state.value.truck && !props.confirmed
  )

  const truckReadOnly = computed(
    () => props.confirmed
    // &&       !proxy.$store.getters.hasPermission('fake permission. only for admin!')
  )
  // #endregion

  function setState(val) {
    ctx.emit('change', val)
  }

  function resetState() {
    crewEmptyError.value = false
    outsourceAgreement.value = null
    allowedAgreements.value = []
    setState(initialState)
  }

  async function getCrew() {
    if (!state.value.truck) return
    let crew = null

    if (isNeedUpdateCrew.value || !props.crew?.driver) {
      try {
        loading.value = true

        crew = await CrewService.getCrewByTruckAndDate({
          truck: state.value.truck,
          date: props.date,
        })

        crewEmptyError.value = !crew
      } finally {
        loading.value = false
      }
    }

    const carrierId = crew?.tkName || state.value.tkName || null

    if (carrierId) {
      allowedAgreements.value =
        await CarrierAgreementService.getAllowedAgreements({
          company: proxy.$store.getters.directoriesProfile,
          date: props.date,
          carrierId: carrierId,
          agreementId: state.value.outsourceAgreement,
        })

      outsourceAgreement.value = carrierAgreementSelector({
        crewState: state.value,
        allowedAgreements: allowedAgreements.value,
        executorInCLientAgreement: props.executorInCLientAgreement,
      })
    }

    setState({
      truck: state.value.truck,
      directiveAgreement: state.value.directiveAgreement,
      trailer: crew?.transport?.trailer || state.value.trailer,
      driver: crew?.driver || state.value.driver,
      tkName: carrierId,
      outsourceAgreement: outsourceAgreement.value?._id || null,
    })
  }

  async function changeTruckHandler(val) {
    if (!val) resetState()
    else {
      state.value.truck = val
      state.value.trailer = null
      state.value.driver = null
      await getCrew()
    }
  }

  const allowChangeOutsourceAgreement = computed(
    () => !props.hasIncomingInvoice && allowedAgreements.value.length > 1
  )

  const changeOutsourceAgreementHandler = () => {
    if (!allowChangeOutsourceAgreement.value) return

    const idx = allowedAgreements.value.findIndex(
      (item) => item._id === state.value.outsourceAgreement
    )

    outsourceAgreement.value =
      allowedAgreements.value[(idx + 1) % allowedAgreements.value.length]

    setState({
      ...state.value,
      directiveAgreement: true,
      outsourceAgreement: outsourceAgreement.value._id,
    })
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
    (val) => {
      state.value = { ...val }
    },
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
    outsourceAgreementName,
    trucks,
    drivers,
    trailers,
    hasTruck,
    changeTruckHandler,
    copyHandler,
    truckReadOnly,
    crewEmptyError,
    allowChangeOutsourceAgreement,
    changeOutsourceAgreementHandler,
    executorAndCustomerMissmatch,
  }
}
