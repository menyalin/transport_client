import { computed } from 'vue'
import store from '@/store'

export default (settings) => {
  const orderStatuses = computed(() => store.getters.orderStatuses)
  const invoiceStatusItems = [
    { text: 'Включен', value: 'included' },
    { text: 'Не включен', value: 'notIncluded' },
  ]
  const docStatuses = computed(() => {
    const docStatusesWithCustomNames = [
      { value: 'accepted', text: 'Приняты' },
      { value: 'needFix', text: 'На исправлении' },
      { value: 'onCheck', text: 'На проверке' },
      { value: 'missing', text: 'Не получены' },
    ]

    store.getters.documentStatuses
      .map((i) => i.value)
      .forEach((i) => {
        if (!docStatusesWithCustomNames.map((j) => j.value).includes(i))
          console.error('useOrderListUtils: unexpected document status value')
      })
    return docStatusesWithCustomNames
  })

  const trailers = computed(() =>
    store.getters
      .trucksForSelect({
        type: 'trailer',
        tkName: settings?.tkName,
      })
      .map((t) => ({
        ...t,
        value: t._id,
        text: t.regNum,
      }))
  )

  const trucks = computed(() =>
    store.getters
      .trucksForSelect({
        type: 'truck',
        tkName: settings?.tkName,
      })
      .map((t) => ({
        ...t,
        value: t._id,
        text: t.regNum,
      }))
  )

  const drivers = computed(() =>
    store.getters.drivers.filter((i) =>
      settings?.tkName ? i.tkName._id === settings.tkName : true
    )
  )
  const clientItems = computed(() =>
    store.getters.partners.filter((i) => i.isClient)
  )

  const addressItems = computed(() => store.getters.addressesForAutocomplete)

  const loadingZoneItems = computed(() => store.getters.zones)

  return {
    orderStatuses,
    docStatuses,
    trailers,
    trucks,
    drivers,
    clientItems,
    addressItems,
    loadingZoneItems,
    invoiceStatusItems,
  }
}
