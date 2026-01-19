import { computed } from 'vue'
import usePersistedRef from '@/shared/hooks/usePersistedRef'
import { useCarrierStore } from '@/entities/carrier/useCarrierStore'

export const useListData = () => {
  const carrierStore = useCarrierStore()

  const headers = computed(() => [
    { value: 'name', text: 'Название ТК' },
    { value: 'outsource', text: 'Привлеченный', width: 150, align: 'center' },
    { value: 'agreements', text: 'Соглашения' },
  ])

  const settings = usePersistedRef(
    { search: null, type: 'all' },
    'CarrierListSettings'
  )

  const carriers = computed(() => {
    switch (settings.value.type) {
      case 'outsource':
        return carrierStore.outsourceCarriers
      case 'own':
        return carrierStore.ownCarriers
      default:
        return carrierStore.carriers
    }
  })

  return {
    carriers,
    loading: carrierStore.loading,
    refreshHandler: carrierStore.getItems,
    settings,
    headers,
  }
}
