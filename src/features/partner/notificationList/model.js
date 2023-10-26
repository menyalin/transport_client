import { PartnerService } from '@/shared/services'

export const useListData = (props, { emit }) => {
  function editHandler(id) {
    emit('editNotify', id)
  }

  async function switchStatusHandler(notificationId) {
    const item = props.items.find((i) => i._id === notificationId)
    if (!item) return
    const partner = await PartnerService.updateIdleTruckNotify(
      props.partnerId,
      notificationId,
      {
        ...item,
        isActive: !item.isActive,
      }
    )
    emit('updatePartner', partner)
  }

  async function deleteHandler(id) {
    const partner = await PartnerService.deleteIdleTruckNotify(
      props.partnerId,
      id
    )
    emit('updatePartner', partner)
  }
  return {
    editHandler,
    deleteHandler,
    switchStatusHandler,
  }
}
