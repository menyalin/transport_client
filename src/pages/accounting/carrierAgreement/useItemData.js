import { ref, watch, computed, getCurrentInstance } from 'vue'

import { CarrierAgreementService } from '@/shared/services'

export const useItemData = (props) => {
  const { proxy } = getCurrentInstance()
  const item = ref(null)
  let loading = ref(false)
  const showError = ref(false)
  const errorMessage = ref('')

  const showDeleteBtn = computed(() => {
    return (
      !!props?.id &&
      proxy.$store.getters.hasPermission('carrierAgreement:delete')
    )
  })

  async function getItem() {
    if (!props.id) return null
    try {
      loading.value = true
      const res = await CarrierAgreementService.getById(props.id)
      item.value = res
    } catch (e) {
      proxy.$store.commit('setError', e.message)
    } finally {
      loading.value = false
    }
  }

  function stateWithCompanyId(state) {
    return {
      ...state,
      company: proxy.$store.getters.directoriesProfile,
    }
  }

  async function submit(formState, saveOnly) {
    let updatedItem
    const updateState = stateWithCompanyId(formState)
    const itemId = props.id ? props.id : item.value?._id
    try {
      if (itemId) {
        updatedItem = await CarrierAgreementService.updateOne(
          itemId,
          updateState
        )
      } else {
        updatedItem = await CarrierAgreementService.create(updateState)
        if (saveOnly)
          proxy.$router.replace({
            name: 'CarrierAgreementDetails',
            params: { id: updatedItem._id },
          })
      }
      if (!saveOnly) {
        proxy.$router.go(-1)
      } else {
        item.value = updatedItem
      }
    } catch (e) {
      showError.value = true
      errorMessage.value = e.response.data
      proxy.$store.commit('setError', e.message)
    }
  }
  async function deleteHandler() {
    try {
      if (props.id) {
        loading.value = true
        await CarrierAgreementService.deleteById(props.id)
        proxy.$router.push('/accounting/carrierAgreements')
        loading.value = false
      } else return null
    } catch (e) {
      loading.value = false
      showError.value = true
      errorMessage.value = e.response.data
      proxy.$store.commit('setError', e.message)
    }
  }

  function dblRowClickHandler(orderId) {
    proxy.$router.push('/orders/' + orderId)
  }

  function cancelHandler() {
    proxy.$router.go(-1)
  }

  watch(
    () => props.id,
    async () => await getItem(),
    { immediate: true }
  )
  return {
    item,
    showDeleteBtn,
    getItem,
    submit,
    loading,
    showError,
    errorMessage,
    deleteHandler,
    dblRowClickHandler,
    cancelHandler,
  }
}
