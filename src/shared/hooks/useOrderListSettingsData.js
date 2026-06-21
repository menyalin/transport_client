import { computed, onMounted, ref } from 'vue'

import { AgreementService } from '@/shared/services'
import { useStore } from 'vuex'
import { useAddressStore } from '@/entities/address'

export default (settings) => {
  const vuexStore = useStore()
  const addressStore = useAddressStore()
  const agreements = ref([])
  async function getAgreements() {
    const res = await AgreementService.getActiveAgreements()
    agreements.value = res
  }
  const orderStatuses = computed(() => vuexStore.getters.orderStatuses)
  const invoiceStatusItems = [
    { title: 'Включен', value: 'included' },
    { title: 'Не включен', value: 'notIncluded' },
  ]
  const docStatuses = computed(() => {
    const docStatusesWithCustomNames = [
      { value: 'accepted', title: 'Приняты' },
      { value: 'needFix', title: 'На исправлении' },
      { value: 'onCheck', title: 'На проверке' },
      { value: 'missing', title: 'Не получены' },
    ]

    vuexStore.getters.documentStatuses
      .map((i) => i.value)
      .forEach((i) => {
        if (!docStatusesWithCustomNames.map((j) => j.value).includes(i))
          console.error('useOrderListUtils: unexpected document status value')
      })
    return docStatusesWithCustomNames
  })

  const agreementItems = computed(() => {
    return agreements.value
      .filter((i) => !i.isOutsourceAgreement)
      .map((i) => ({ _id: i._id, name: i.name }))
      .sort((a, b) => (a.name > b.name ? 1 : -1))
  })

  const trailers = computed(() =>
    vuexStore.getters
      .trucksForSelect({
        type: 'trailer',
        tkName: settings?.tkName,
      })
      .map((t) => ({
        value: t._id,
        title: t.regNum,
      }))
  )

  const trucks = computed(() =>
    vuexStore.getters
      .trucksForSelect({
        type: 'truck',
        tkName: settings?.tkName,
      })
      .map((t) => ({
        value: t._id,
        title: t.regNum,
      }))
  )

  const drivers = computed(() =>
    vuexStore.getters.drivers.filter((i) =>
      settings?.tkName ? i.tkName._id === settings.tkName : true
    )
  )
  const clientItems = computed(() => vuexStore.getters.partners.filter((i) => i.isClient))

  const addressItems = computed(() => addressStore.addressesForAutocomplete)

  const loadingZoneItems = computed(() => vuexStore.getters.zones)

  onMounted(async () => {
    await getAgreements()
  })
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
    agreementItems,
  }
}
