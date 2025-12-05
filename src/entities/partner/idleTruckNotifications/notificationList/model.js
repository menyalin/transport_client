import { computed } from 'vue'
import usePersistedRef from '@/shared/hooks/usePersistedRef'
import { PartnerService } from '@/shared/services'
import { useAgreements } from '@/entities/agreement'
import store from '@/store'

export const useListData = (props, { emit }) => {
  const { allAgreementMap } = useAgreements()
  const addressesMap = computed(() => store.getters.addressMap)
  const isActiveComparatorItems = [
    { value: 'all', text: 'Все' },
    { value: 'active', text: 'Активные' },
    { value: 'inactive', text: 'Неактивные' },
  ]

  function editHandler(id) {
    emit('editNotify', id)
  }

  function isActiveComparator(a) {
    if (listSettings.value.isActive === 'all') return true
    if (listSettings.value.isActive === 'active') return a.isActive === true
    if (listSettings.value.isActive === 'inactive') return a.isActive === false
  }

  const listSettings = usePersistedRef(
    { isActive: 'all', searchStr: '' },
    'idleTruckNotifyListSettings:' + props.partnerId
  )

  const filteredItems = computed(() => {
    return (
      props.items
        .map(i => ({
          ...i,
          addresses: i.addresses.map(a => addressesMap.value.get(a)?.shortName || '__').join(', '),
          agreement: i.agreement ? allAgreementMap.value.get(i.agreement)?.name : null,
        }))
        ?.filter(isActiveComparator) ?? []
    )
  })

  async function switchStatusHandler(notificationId) {
    const item = props.items.find(i => i._id === notificationId)
    if (!item) return
    const partner = await PartnerService.updateIdleTruckNotify(props.partnerId, notificationId, {
      ...item,
      isActive: !item.isActive,
    })
    emit('change', partner.idleTruckNotifications)
  }

  async function deleteHandler(id) {
    const partner = await PartnerService.deleteIdleTruckNotify(props.partnerId, id)
    emit('change', partner.idleTruckNotifications)
  }
  return {
    editHandler,
    deleteHandler,
    switchStatusHandler,
    listSettings,
    filteredItems,
    isActiveComparatorItems,
  }
}
