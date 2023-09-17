import { ref } from 'vue'
import { PartnerService } from '@/shared/services'

export const useWidgetModel = (props, { emit }) => {
  const dialog = ref(false)
  const loading = ref(false)

  function addNotificationHandler() {
    dialog.value = true
  }

  function cancelHandler() {
    loading.value = false
    dialog.value = false
  }

  async function submitHandler(formState) {
    if (!props.partner._id)
      throw new Error(
        'IdleTruckNotifyWidget : submitHandler : partnerId is missing'
      )
    loading.value = true
    const updatedPartner = await PartnerService.addIdleTruckNotify(
      props.partner._id,
      formState
    )
    emit('updatePartner', updatedPartner)
    cancelHandler()
  }

  return {
    dialog,
    addNotificationHandler, // Добавить новое оповещение
    cancelHandler,
    submitHandler,
    loading,
  }
}
