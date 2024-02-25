import { AddressService } from '@/shared/services'

const _getAddressTextForAutocomplete = (item, partnersMap) => {
  let res = ''
  if (item.partner && partnersMap.has(item.partner))
    res += `${partnersMap.get(item.partner).name} - `
  if (item.shortName) res += `${item.shortName} - `
  res += item.name
  return res
}

export default {
  state: {
    addresses: [],
  },
  mutations: {
    clearDirectories(state) {
      state.addresses = []
    },
    setAddresses(state, payload) {
      state.addresses = payload
    },
    addAddress({ addresses }, payload) {
      if (addresses.findIndex((item) => item._id === payload._id) === -1) {
        addresses.push(payload)
      }
    },
    updateAddress({ addresses }, payload) {
      const ind = addresses.findIndex((item) => item._id === payload._id)
      if (ind !== -1) addresses.splice(ind, 1, payload)
    },
    deleteAddress(state, id) {
      state.addresses = state.addresses.filter((item) => item._id !== id)
    },
  },
  actions: {
    async getAddresses({ commit, getters }, directiveUpdate) {
      try {
        commit('setLoading', true)
        if (
          directiveUpdate ||
          (getters.addresses.length === 0 && getters.directoriesProfile)
        ) {
          commit('setAddresses', [])
          const addressList = await AddressService.getByDirectoriesProfile(
            getters.directoriesProfile
          )
          commit('setAddresses', addressList)
        }
        commit('setLoading', false)
      } catch (e) {
        commit('setLoading', false)
        commit('setError', e.response?.data?.message)
      }
    },
  },
  getters: {
    addressesForAutocomplete: (
      { addresses },
      { directoriesProfile, partnersMap }
    ) =>
      addresses
        .filter((item) => item.company === directoriesProfile)
        .map((item) => ({
          value: item._id,
          text: _getAddressTextForAutocomplete(item, partnersMap),
          loading: item.isShipmentPlace,
          unloading: item.isDeliveryPlace,
          service: item.isService,
          partner: item.partner,
        })),

    addresses: ({ addresses }, { directoriesProfile, partnersMap }) =>
      addresses
        .filter((item) => item.company === directoriesProfile)
        .map((a) => ({
          ...a,
          partnerName: partnersMap.get(a.partner)?.name,
        })),
    addressMap: ({ addresses }) =>
      new Map(addresses.map((item) => [item._id, item])),

    addressIdsWithDateControlSet: ({ addresses }, { partners }) => {
      const controlledPartners = partners
        .filter((partner) => partner?.group === 'fts')
        .map((i) => i._id)

      const controlledAddresses = addresses
        .filter((address) => controlledPartners.includes(address.partner))
        .map((i) => i._id)
      return new Set(controlledAddresses)
    },
  },
}
