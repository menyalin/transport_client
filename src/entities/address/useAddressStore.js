import { defineStore } from 'pinia'
import { computed, getCurrentInstance } from 'vue'

export const useAddressStore = defineStore('AddressStore', () => {
  // need remove vuex store
  const { proxy } = getCurrentInstance()

  const addresses = computed(() => proxy.$store.getters.addresses)

  const addressesMap = computed(() => {
    return new Map(addresses.value.map((item) => [item._id, item]))
  })

  function getById(id) {
    return addressesMap.value.get(id)
  }

  return {
    getById,
    addresses,
    addressesMap,
  }
})
