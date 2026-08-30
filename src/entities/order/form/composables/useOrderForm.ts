import { ref, reactive, computed } from 'vue'
import { useStore } from 'vuex'

import { useAddressStore } from '@/entities/address'

import { useOrderRoute } from './useOrderRoute'
import { useOrderPricing } from './useOrderPricing'
import { useOrderClient } from './useOrderClient'

export interface OrderFormProps {
  order?: Record<string, any> | null
  loading?: boolean
  getCarrierAgreementById?: (id: string) => Promise<Record<string, any> | null>
}

interface CargoParams {
  weight?: number | null
  places?: number | null
  note?: string | null
  tRegime?: string | null
}

interface Grade {
  grade?: number | null
  note?: string | null
}

interface OrderState {
  status?: string
  [key: string]: any
}

interface OrderFormData {
  startPositionDate: string | null
  note: string | null
  noteAccountant: string | null
  docsRegistry: any
  paymentInvoices: any[] | null
  [key: string]: any
}

export function useOrderForm(props: OrderFormProps) {
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
  const docs = ref<any[]>([])
  const paymentToDriver = ref<Record<string, any>>({})
  const priceDialog = ref(false)
  const createTemplateLoading = ref(false)
  const templateDialog = ref(false)
  const templateName = ref<string | null>(null)
  const templateSelector = ref<string | null>(null)
  const orderId = ref<string | null>(null)

  const cargoParams = ref<CargoParams>({
    weight: null,
    places: null,
    note: null,
    tRegime: null,
  })

  const grade = ref<Grade>({
    grade: null,
    note: null,
  })

  const analytics = ref<Record<string, any>>({})

  const state = ref<OrderState>({
    status: 'needGet',
  })

  const reqTransport = ref<Record<string, any>>({})

  const confirmedCrew = ref<Record<string, any>>({})

  const form = reactive<OrderFormData>({
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
    const tmp: number[][] = []
    route.value
      .filter((point: any) => !point.isReturn)
      .forEach((point: any) => {
        if (addressMap.value.has(point.address)) {
          tmp.push(
            addressMap.value
              .get(point.address)
              ?.geo?.split(', ')
              .map((s: string) => parseFloat(s))
              .reverse()
          )
        }
      })
    return tmp
  })

  const preparedRoute = computed({
    get: () => {
      return route.value.map((point: any, ind: number) => ({
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

  async function changeCrewHandler(newValue: Record<string, any>) {
    if (newValue?.outsourceAgreement && props.getCarrierAgreementById)
      updateCarrierAgreement(await props.getCarrierAgreementById(newValue.outsourceAgreement))
  }

  // Упрощённая версия setFormFields
  function setFormFields(val: Record<string, any>) {
    // Список полей для обновления
    const fieldMap: Record<string, any> = {
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
    Object.entries(fieldMap).forEach(([key, field]) => {
      if (val[key] !== undefined) field.value = val[key]
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
