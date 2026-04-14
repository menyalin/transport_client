import { computed } from 'vue'
import { useAddressStore } from '@/entities/address'

export const useOrderRouteData = (props, _ctx) => {
  const addressStore = useAddressStore()

  const shipperPointCondition = (routePoint) => {
    return routePoint.type === 'loading'
  }

  const consigneePointCondition = (routePoint) => {
    return routePoint.type === 'unloading'
  }

  const getAddressName = (addressId) => {
    const address = addressStore.addressesMap.get(addressId)
    if (!address) return '!! address info is missing !!'
    return address.name || '__'
  }

  const routePointTransform = (routePoint) => {
    return {
      pointId: routePoint._id,
      date: routePoint.plannedDateDoc,
      value: routePoint.address,
      text: getAddressName(routePoint.address),
    }
  }

  const shipperAddressItems = computed(() => {
    return props.route.filter(shipperPointCondition).map(routePointTransform)
  })

  const consigneeAddressItems = computed(() => {
    return props.route.filter(consigneePointCondition).map(routePointTransform)
  })

  return {
    shipperAddressItems,
    consigneeAddressItems,
  }
}
