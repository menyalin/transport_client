import { PartnerService } from '@/shared/services'

export const useListData = (props, { emit }) => {
  function editHandler(id) {
    emit('editNotify', id)
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
  }
}
