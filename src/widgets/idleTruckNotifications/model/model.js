import { ref } from 'vue'
import { PartnerService } from '@/shared/services'

export const useWidgetModel = (props, { emit }) => {
  let editableItem = ref({})
  const dialog = ref(false)
  const loading = ref(false)

  function addNotificationHandler() {
    editableItem.value = {}
    dialog.value = true
  }

  function cancelHandler() {
    editableItem.value = Object.assign({})
    loading.value = false
    dialog.value = false
  }
  function editNotifyHandler(id) {
    const item = props.partner.idleTruckNotifications.find(
      (notify) => notify._id === id
    )
    editableItem.value = Object.assign({}, item)
    dialog.value = true
  }

  async function submitHandler(formState) {
    if (!props.partner._id)
      throw new Error(
        'IdleTruckNotifyWidget : submitHandler : partnerId is missing'
      )
    loading.value = true
    let updatedPartner
    if (formState._id)
      updatedPartner = await PartnerService.updateIdleTruckNotify(
        props.partner._id,
        formState._id,
        formState
      )
    else
      updatedPartner = await PartnerService.addIdleTruckNotify(
        props.partner._id,
        formState
      )

    emit('updatePartner', updatedPartner)
    cancelHandler()
  }

  return {
    editableItem,
    dialog,
    addNotificationHandler, // Добавить новое оповещение
    cancelHandler,
    submitHandler,
    loading,
    editNotifyHandler,
  }
}
