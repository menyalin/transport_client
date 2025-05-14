import { AgreementService } from '@/shared/services/index'
import store from '@/store/index'
import { ref, computed, watch } from 'vue'
import { clientAgreementSelector } from './utils/clientAgreementSelector'

export const useClientBlock = (props, ctx) => {
  const loading = ref(true)
  const currentAgreement = ref(null)
  const allowedAgreements = ref([])

  const initialState = {
    client: null,
    num: null,
    auctionNum: null,
    agreement: null,
    directiveAgreement: false,
  }
  const state = ref(initialState)

  const allowToChangeAgreement = computed(() => {
    if (props.orderConfirmed || state.value.directiveAgreement) return false
    return true
  })

  function setAgreement() {
    if (allowToChangeAgreement.value) {
      currentAgreement.value = null
      currentAgreement.value = clientAgreementSelector({
        allowedAgreements: allowedAgreements.value,
        carrierId: props.carrier,
      })
      state.value = {
        ...state.value,
        agreement: currentAgreement.value?._id ?? null,
        directiveAgreement: false,
      }
      ctx.emit('change', state.value)
    } else {
      currentAgreement.value = allowedAgreements.value.find(
        (i) => i._id === state.value.agreement
      )
    }

    ctx.emit('updateAgreement', currentAgreement.value)
  }

  async function getAllowedAgreements() {
    if (!props.routeDate || !state.value.client) {
      loading.value = false
      return
    }
    try {
      loading.value = true
      allowedAgreements.value = await AgreementService.getForClient({
        client: state.value.client,
        date: new Date(props.routeDate).toISOString(),
        currentAgreementId: state.value.agreement,
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
    ctx.emit('change', state.value)
  }

  function changeAgreementHandler() {
    const idx =
      allowedAgreements.value.findIndex(
        (i) => i._id === state.value.agreement
      ) || 0
    currentAgreement.value =
      allowedAgreements.value[(idx + 1) % allowedAgreements.value.length]

    state.value = {
      ...state.value,
      agreement: currentAgreement.value._id,
      directiveAgreement: true,
    }
    ctx.emit('change', state.value)
  }
  function changeFieldHandler(value, field) {
    state.value = { ...state.value, [field]: value }
    ctx.emit('change', state.value)
  }

  watch(
    () => props.item,
    async (newVal, oldVal) => {
      state.value = { ...newVal }
      if (newVal?.client !== oldVal?.client) {
        await getAllowedAgreements()
      }
    },
    { deep: true, immediate: true }
  )

  watch(
    () => props.carrier,
    (newVal, oldVal) => {
      if (newVal === oldVal) return
      setAgreement()
    }
  )

  watch(
    () => props.routeDate,
    async () => await getAllowedAgreements(),
    { immediate: true }
  )

  watch(allowedAgreements, setAgreement)

  return {
    state,
    loading,
    currentAgreement,
    changeClientHandler,
    changeFieldHandler,
    changeAgreementHandler,
    clientItems: computed(() =>
      store.getters.partners
        .filter((p) => p.isClient)
        .map((i) => ({ value: i._id, text: i.name }))
    ),
    showChangeAgreementBtn: computed(
      () => allowedAgreements.value?.length > 1 && !props.agreementDisabled
    ),

    agreementNameSring: computed(() => {
      const suffix = state.value.directiveAgreement
        ? ' (Установлено вручную)'
        : ''
      return currentAgreement.value
        ? [currentAgreement.value.name + suffix]
        : ['Соглашение отсутствует']
    }),
  }
}
