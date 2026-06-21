import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import store from '@/store'

const _getAddressTextForAutocomplete = (item, partnersMap) => {
  let res = ''
  if (item.partner && partnersMap.has(item.partner))
    res += `${partnersMap.get(item.partner).name} - `
  if (item.shortName) res += `${item.shortName} - `
  res += item.name
  return res
}

export const useAddressStore = defineStore('AddressStore', () => {
  const addresses = ref([])

  const directoriesProfile = computed(() => store.getters.directoriesProfile)

  const addressMap = computed(() => new Map(addresses.value.map((i) => [i._id, i])))

  const filteredAddresses = computed(() => {
    const partners = store.getters.partners
    const partnersMap = new Map(partners.map((i) => [i._id, i]))
    return addresses.value
      .filter((item) => item.company === directoriesProfile.value)
      .map((a) => ({
        ...a,
        partnerName: partnersMap.get(a.partner)?.name,
      }))
  })

  const addressesForAutocomplete = computed(() => {
    const partners = store.getters.partners
    const partnersMap = new Map(partners.map((i) => [i._id, i]))
    return addresses.value
      .filter((item) => item.company === directoriesProfile.value)
      .map((item) => ({
        value: item._id,
        text: _getAddressTextForAutocomplete(item, partnersMap),
        loading: item.isShipmentPlace,
        unloading: item.isDeliveryPlace,
        service: item.isService,
        partner: item.partner,
      }))
  })

  const addressIdsWithDateControlSet = computed(() => {
    const partners = store.getters.partners
    const controlledPartners = partners
      .filter((partner) => partner?.group === 'fts')
      .map((i) => i._id)

    const controlledAddresses = addresses.value
      .filter((address) => controlledPartners.includes(address.partner))
      .map((i) => i._id)
    return new Set(controlledAddresses)
  })

  function getById(id) {
    return addressMap.value.get(id)
  }

  async function getAddresses(directiveUpdate) {
    try {
      const { AddressService } = await import('@/shared/services')
      store.commit('setLoading', true)
      if (directiveUpdate || (addresses.value.length === 0 && directoriesProfile.value)) {
        addresses.value = []
        const addressList = await AddressService.getByDirectoriesProfile(directoriesProfile.value)
        addresses.value = addressList
      }
      store.commit('setLoading', false)
    } catch (e) {
      store.commit('setLoading', false)
      store.commit('setError', e.response?.data?.message)
    }
  }

  function setAddresses(payload) {
    addresses.value = payload
  }

  function addAddress(payload) {
    if (addresses.value.findIndex((item) => item._id === payload._id) === -1) {
      addresses.value.push(payload)
    }
  }

  function updateAddress(payload) {
    const ind = addresses.value.findIndex((item) => item._id === payload._id)
    if (ind !== -1) addresses.value.splice(ind, 1, payload)
  }

  function deleteAddress(id) {
    addresses.value = addresses.value.filter((item) => item._id !== id)
  }

  function clear() {
    addresses.value = []
  }

  return {
    addresses,
    addressMap,
    filteredAddresses,
    addressesForAutocomplete,
    addressIdsWithDateControlSet,
    getById,
    getAddresses,
    setAddresses,
    addAddress,
    updateAddress,
    deleteAddress,
    clear,
  }
})
