import { AgreementService } from '@/shared/services/index'
import store from '@/store/index'
import { ref, computed, watch } from 'vue'
import { clientAgreementSelector } from './utils/clientAgreementSelector'

export const useClientBlock = (model, props, emits) => {
  const loading = ref(false)
  const currentAgreement = ref(null)
  const allowedAgreements = ref([])

  const allowToChangeAgreement = computed(() => {
    if (props.orderConfirmed || model.value.directiveAgreement) return false
    return true
  })

  function setAgreement() {
    if (allowToChangeAgreement.value) {
      currentAgreement.value = null
      currentAgreement.value = clientAgreementSelector({
        allowedAgreements: allowedAgreements.value,
        carrierId: props.carrier,
      })
      model.value = {
        ...model.value,
        agreement: currentAgreement.value?._id ?? null,
        directiveAgreement: false,
      }
    } else {
      currentAgreement.value = allowedAgreements.value.find((i) => i._id === model.value.agreement)
    }
    emits('update-agreement', currentAgreement.value)
  }

  async function getAllowedAgreements() {
    if (!props.routeDate || !model.value.client) {
      loading.value = false
      return
    }
    try {
      loading.value = true
      allowedAgreements.value = await AgreementService.getForClient({
        client: model.value.client,
        date: new Date(props.routeDate).toISOString(),
        currentAgreementId: model.value.agreement,
      })
    } catch (e) {
      store.commit('setError', e)
      console.error(e)
    } finally {
      loading.value = false
    }
  }
  async function changeClientHandler(val) {
    if (!val) return
    await getAllowedAgreements()
  }

  function changeAgreementHandler() {
    const idx = allowedAgreements.value.findIndex((i) => i._id === model.value.agreement) || 0
    currentAgreement.value = allowedAgreements.value[(idx + 1) % allowedAgreements.value.length]

    model.value = {
      ...model.value,
      agreement: currentAgreement.value._id,
      directiveAgreement: true,
    }
  }

  watch(
    () => model.value.client,
    async (newClient, oldClient) => {
      console.log('watch', { newClient, oldClient })
      if (newClient && newClient !== oldClient) {
        console.log('watch before new query')
        await getAllowedAgreements()
        setAgreement()
      }
    },
    { immediate: true }
  )

  // watch(
  //   () => props.carrier,
  //   (newVal, oldVal) => {
  //     if (newVal === oldVal) return
  //     setAgreement()
  //   }
  // )

  // watch(
  //   () => props.routeDate,
  //   async () => await getAllowedAgreements(),
  //   { immediate: true }
  // )

  // watch(allowedAgreements, setAgreement)

  return {
    loading,
    currentAgreement,
    changeClientHandler,
    changeAgreementHandler,
    clientItems: computed(() =>
      store.getters.partners.filter((p) => p.isClient).map((i) => ({ value: i._id, text: i.name }))
    ),
    showChangeAgreementBtn: computed(
      () => allowedAgreements.value?.length > 1 && !props.agreementDisabled
    ),

    agreementNameSring: computed(() => {
      const suffix = model.value.directiveAgreement ? ' (Установлено вручную)' : ''
      return currentAgreement.value
        ? [currentAgreement.value.name + suffix]
        : ['Соглашение отсутствует']
    }),
  }
}
