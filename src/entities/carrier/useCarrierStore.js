import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import CarrierService from './carrier.service'
import { useAppStore } from '@/shared/useAppStore'

export const useCarrierStore = defineStore('CarrierStore', () => {
  const appStore = useAppStore()

  const carriers = ref([])
  const loading = ref(false)
  const initialized = ref(false)

  const queryParams = computed(() => ({
    company: appStore.userCurrentProfile,
  }))
  const ownCarriers = computed(() => carriers.value.filter((i) => !i.outsource))
  const outsourceCarriers = computed(() =>
    carriers.value.filter((i) => i.outsource)
  )
  const allowUseCustomerRoleCarriers = computed(() => {
    return carriers.value.filter((i) => i.allowUseCustomerRole)
  })

  const carriersMap = computed(() => {
    let map = new Map()
    carriers.value.forEach((item) => {
      map.set(item._id, item)
    })
    return map
  })

  async function getItems() {
    try {
      loading.value = true
      const res = await CarrierService.getList(queryParams.value)
      carriers.value = res.items.sort((a, b) => {
        if (a.name > b.name) return 1
        else return -1
      })
      initialized.value = true
    } finally {
      loading.value = false
    }
  }

  async function getById(id) {
    try {
      loading.value = true
      return await CarrierService.getById(id)
    } finally {
      loading.value = false
    }
  }

  async function create(carrier) {
    try {
      loading.value = true
      return await CarrierService.create(carrier)
    } finally {
      loading.value = false
    }
  }

  async function updateOne(id, body) {
    try {
      loading.value = true
      return await CarrierService.updateOne(id, body)
    } finally {
      loading.value = false
    }
  }

  async function deleteOne(id) {
    try {
      loading.value = true
      await CarrierService.deleteById(id)
      return true
    } finally {
      loading.value = false
    }
  }

  // Автоматически загружаем данные при создании store
  setTimeout(() => {
    if (!initialized.value && !loading.value) {
      getItems()
    }
  }, 0)

  return {
    carriers,
    queryParams,
    loading,
    initialized,
    ownCarriers,
    outsourceCarriers,
    allowUseCustomerRoleCarriers,
    getItems,
    carriersMap,
    create,
    getById,
    updateOne,
    deleteOne,
  }
})
