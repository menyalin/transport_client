import { ref, reactive, computed } from 'vue'
import { useStore } from 'vuex'
import { useAddressStore } from '@/entities/address'
import { useOrderRoute } from './useOrderRoute'
import { useOrderPricing } from './useOrderPricing'
import { useOrderClient } from './useOrderClient'

export function useOrderForm(props) {
  const store = useStore()
  const addressStore = useAddressStore()

  // Используем созданные composables
  const {
    route,
    currentPointInd,
    routeDate,
    routeCompleted,
    isExistFirstArrivalDate,
    isValidDatesInRoute,
    isValidRoute,
    getMinArrivalDate,
    isDisabledArrivalDate,
    isDisabledDepartureDate,
    setRoute,
    resetRoute,
  } = useOrderRoute(
    props.order?.route || [
      { type: 'loading', address: null, plannedDate: '', note: '' },
      { type: 'unloading', address: null, plannedDate: '', note: '' },
    ]
  )

  const { prices, prePrices, finalPrices, outsourceCosts, setPricing, resetPricing } =
    useOrderPricing()

  const {
    agreement,
    carrierAgreement,
    client,
    isValidClientInfo,
    setClient,
    updateAgreement,
    updateCarrierAgreement,
    resetClient,
  } = useOrderClient()

  // Остальное состояние
  const processingBeforeSubmit = ref(false)
  const docs = ref([])
  const paymentToDriver = ref({})
  const priceDialog = ref(false)
  const createTemplateLoading = ref(false)
  const templateDialog = ref(false)
  const templateName = ref(null)
  const templateSelector = ref(null)
  const orderId = ref(null)

  const cargoParams = ref({
    weight: null,
    places: null,
    note: null,
    tRegime: null,
  })

  const grade = ref({
    grade: null,
    note: null,
  })

  const analytics = ref({})

  const state = ref({
    status: 'needGet',
  })

  const reqTransport = ref({})

  const confirmedCrew = ref({})

  const form = reactive({
    startPositionDate: null,
    note: null,
    noteAccountant: null,
    docsRegistry: null,
    paymentInvoices: [],
  })

  // Computed
  const hasIncomingInvoice = computed(() => {
    return props.order?.incomingInvoice && props.order?.incomingInvoice._id
  })

  const hasPaymentInvoices = computed(() => {
    return Boolean(props.order?.paymentInvoices && props.order?.paymentInvoices.length)
  })

  const disabledInPaymentInvoice = computed(() => {
    if (!hasPaymentInvoices.value) return false
    const invoice = props.order?.paymentInvoices[0] || null
    return invoice && invoice.status !== 'inProcess'
  })

  const showPaymentToDriver = computed(() => {
    console.log('confirmedCrew.value: ', confirmedCrew.value)
    return (
      store.getters.hasPermission('order:readPaymentToDriver') &&
      !confirmedCrew.value.outsourceAgreement
    )
  })

  const showFinalPriceDialog = computed(() => {
    return (
      !!store.getters.hasPermission('order:readFinalPrices') &&
      !!client.value?.agreement &&
      !!props.order?._id &&
      !!isValidRoute.value
    )
  })

  const disabledSubmitForm = computed(() => {
    let hasPermission
    if (state.value.status === 'completed') {
      hasPermission = store.getters.allowedPeriodForPermission({
        permission: 'order:daysForWrite',
        date: route.value[route.value.length - 1].departureDate,
      })
    } else hasPermission = store.getters.hasPermission('order:daysForWrite')

    return processingBeforeSubmit.value || props.loading || !hasPermission
  })

  const dateForCrew = computed(() => {
    if (route.value[0]?.plannedDate) return route.value[0]?.plannedDate
    return form.startPositionDate
  })

  const carrierVatRateInfo = computed(() => {
    if (!carrierAgreement.value) return
    return {
      date: dateForCrew.value,
      vatRate: carrierAgreement.value?.vatRate,
      usePriceWithVat: carrierAgreement.value?.usePriceWithVAT,
    }
  })

  const isValidGrade = computed(() => {
    if (!grade.value.grade) return false
    if (grade.value.grade === 2) return true
    else return !!grade.value.note
  })

  const enableConfirmOrder = computed(() => {
    return !!confirmedCrew.value.driver
  })

  const enableRefuseOrder = computed(() => {
    return !confirmedCrew.value.truck && !!form.note
  })

  const orderConfirmed = computed(() => {
    return state.value.driverNotified || state.value.clientNotified
  })

  const orderInProgress = computed(() => {
    return orderConfirmed.value && state.value.status === 'inProgress'
  })

  const showGradeBlock = computed(() => {
    return routeCompleted.value
  })

  const addressMap = computed(() => {
    return addressStore.addressMap
  })

  const coords = computed(() => {
    let tmp = []
    route.value
      .filter((p) => !p.isReturn)
      .forEach((point) => {
        if (addressMap.value.has(point.address)) {
          tmp.push(
            addressMap.value
              .get(point.address)
              ?.geo.split(', ')
              .map((s) => parseFloat(s))
              .reverse()
          )
        }
      })
    return tmp
  })

  const preparedRoute = computed({
    get: () => {
      return route.value.map((point, ind) => ({
        ...point,
        arrivalDateDisabled: isDisabledArrivalDate(ind),
        departureDateDisabled: isDisabledDepartureDate(ind),
        minArrivalDate: getMinArrivalDate(ind),
      }))
    },
    set: (val) => {
      setRoute(val)
    },
  })

  // Функции
  function openPriceDialog() {
    priceDialog.value = true
  }

  function cancelCreateTemplate() {
    templateDialog.value = false
    templateName.value = null
  }

  async function changeCrewHandler(newValue) {
    if (newValue.outsourceAgreement && props.getCarrierAgreementById)
      updateCarrierAgreement(await props.getCarrierAgreementById(newValue.outsourceAgreement))
  }

  // Упрощённая версия setFormFields
  function setFormFields(val) {
    // Список полей для обновления
    const fieldMap = {
      grade,
      client,
      confirmedCrew,
      state,
      cargoParams,
      reqTransport,
      route,
      analytics,
      docs,
      paymentToDriver,
    }

    // Обновляем поля через map
    Object.entries(fieldMap).forEach(([key, ref]) => {
      if (val[key] !== undefined) ref.value = val[key]
    })

    // Цены через специальный метод
    setPricing(val)

    // Form поля (reactive)
    const formKeys = Object.keys(form)
    formKeys.forEach((key) => {
      if (val[key] !== undefined) form[key] = val[key]
    })

    if (val._id) orderId.value = val._id
  }

  function resetForm() {
    const keys = Object.keys(form)
    resetRoute()
    grade.value = {}
    resetClient()
    state.value = {}
    cargoParams.value = {}
    reqTransport.value = {}
    analytics.value = {}
    paymentToDriver.value = {}
    resetPricing()

    docs.value = []
    keys.forEach((key) => {
      form[key] = null
    })
  }

  return {
    // State
    processingBeforeSubmit,
    orderId,
    docs,
    paymentToDriver,
    priceDialog,
    createTemplateLoading,
    templateDialog,
    templateName,
    templateSelector,
    cargoParams,
    grade,
    analytics,
    state,
    reqTransport,
    confirmedCrew,
    form,

    // From composables
    route,
    currentPointInd,
    routeDate,
    routeCompleted,
    isExistFirstArrivalDate,
    isValidDatesInRoute,
    isValidRoute,
    getMinArrivalDate,
    isDisabledArrivalDate,
    isDisabledDepartureDate,
    preparedRoute,

    prices,
    prePrices,
    finalPrices,
    outsourceCosts,

    agreement,
    carrierAgreement,
    client,
    isValidClientInfo,

    // Other computed
    hasIncomingInvoice,
    hasPaymentInvoices,
    disabledInPaymentInvoice,
    showPaymentToDriver,
    showFinalPriceDialog,
    disabledSubmitForm,
    dateForCrew,
    carrierVatRateInfo,
    isValidGrade,
    enableConfirmOrder,
    enableRefuseOrder,
    orderConfirmed,
    orderInProgress,
    showGradeBlock,
    coords,

    // Methods
    openPriceDialog,
    cancelCreateTemplate,
    changeCrewHandler,
    setFormFields,
    resetForm,
    setClient,
    updateAgreement,
    setRoute,
    setPricing,
  }
}
