import { computed, ref, watch, nextTick } from 'vue'
import { CrewService, CarrierAgreementService } from '@/shared/services'
import putCrewDataToClipboard from './putCrewDataToClipboard'
import { carrierAgreementSelector } from './utils/carrierAgreementSelector'
import { useStore } from 'vuex'

export const useConfirmedCrew = (model, props, emits) => {
  const vuexStore = useStore()

  const initialState = {
    truck: null,
    trailer: null,
    driver: null,
    outsourceAgreement: null,
    tkName: null,
    directiveAgreement: false,
  }

  const loading = ref(false)
  const crewEmptyError = ref(false)
  const allowedAgreements = ref([])
  const outsourceAgreement = ref(null)
  // #region computeds
  const showOutsourceAgreementRow = computed(() => !!outsourceAgreement.value)

  const outsourceAgreementName = computed(() => outsourceAgreement.value?.name)
  const trucks = computed(() =>
    vuexStore.getters.trucks
      .filter((item) => item.type === 'truck')
      .map((item) => ({ value: item._id, text: item.regNum }))
  )

  const drivers = computed(() =>
    vuexStore.getters.drivers.map((item) => ({
      value: item._id,
      text: item.fullName,
    }))
  )
  const executorAndCustomerMissmatch = computed(() => {
    if (!outsourceAgreement.value) return false
    return props.executorIdInClientAgreement !== outsourceAgreement.value.customer
  })
  const trailers = computed(() =>
    vuexStore.getters.trucks
      .filter((item) => item.type === 'trailer')
      .map((item) => ({ value: item._id, text: item.regNum }))
  )

  const isNeedUpdateCrew = computed(() => props.date && model.value.truck && !props.confirmed)

  const truckReadOnly = computed(
    () => props.confirmed
    // &&       !proxy.$store.getters.hasPermission('fake permission. only for admin!')
  )
  // #endregion

  function setState(val) {
    emits('update:model-value', { ...val })
  }

  function resetState() {
    crewEmptyError.value = false
    outsourceAgreement.value = null
    allowedAgreements.value = []
    setState(initialState)
  }

  async function getCrew() {
    if (!model.value.truck) {
      allowedAgreements.value = []
      return
    }
    let crew = null

    if (isNeedUpdateCrew.value || !model.value?.driver) {
      try {
        loading.value = true

        crew = await CrewService.getCrewByTruckAndDate({
          truck: model.value.truck,
          date: props.date,
        })

        crewEmptyError.value = !crew
      } finally {
        loading.value = false
      }
    }

    const carrierId = crew?.tkName || model.value.tkName || null

    if (carrierId) {
      allowedAgreements.value = await CarrierAgreementService.getAllowedAgreements({
        company: vuexStore.getters.directoriesProfile,
        date: props.date,
        carrierId: carrierId,
        agreementId: model.value.outsourceAgreement,
      })

      outsourceAgreement.value = carrierAgreementSelector({
        crewState: model.value,
        allowedAgreements: allowedAgreements.value,
        executorInCLientAgreement: props.executorInCLientAgreement,
      })
    }

    setState({
      truck: model.value.truck,
      directiveAgreement: model.value.directiveAgreement,
      trailer: crew?.transport?.trailer || null,
      driver: crew?.driver || null,
      tkName: carrierId,
      outsourceAgreement: outsourceAgreement.value?._id || null,
    })
  }

  function changeTruckHandler(val) {
    if (!val) {
      resetState()
      return
    }
    setState({ ...model.value, truck: val })
    nextTick(async () => {
      await getCrew()
    })
  }

  const allowChangeOutsourceAgreement = computed(
    () => !props.hasIncomingInvoice && allowedAgreements.value.length > 1
  )

  const changeOutsourceAgreementHandler = () => {
    if (!allowChangeOutsourceAgreement.value) return

    const idx = allowedAgreements.value.findIndex(
      (item) => item._id === model.value.outsourceAgreement
    )

    outsourceAgreement.value = allowedAgreements.value[(idx + 1) % allowedAgreements.value.length]

    setState({
      ...model.value,
      directiveAgreement: true,
      outsourceAgreement: outsourceAgreement.value._id,
    })
  }

  function copyHandler() {
    if (!model.value.truck || !model.value.driver) return null
    const truck = vuexStore.getters.trucksMap.get(model.value.truck)
    const driver = vuexStore.getters.driversMap.get(model.value.driver)
    const trailer = model.value.trailer ? vuexStore.getters.trucksMap.get(model.value.trailer) : {}
    putCrewDataToClipboard({ truck, driver, trailer })
  }

  watch(crewEmptyError, (val) => {
    if (val) {
      outsourceAgreement.value = null
      model.value.outsourceAgreement = null
      model.value.tkName = null
    }
  })

  watch(
    () => props.date,
    async () => await getCrew(),
    { immediate: true }
  )

  return {
    loading,
    showOutsourceAgreementRow,
    outsourceAgreementName,
    trucks,
    drivers,
    trailers,
    changeTruckHandler,
    copyHandler,
    truckReadOnly,
    crewEmptyError,
    allowChangeOutsourceAgreement,
    changeOutsourceAgreementHandler,
    executorAndCustomerMissmatch,
  }
}
