import { ref, computed, watch, type Ref, type ComputedRef } from 'vue'
import { useRoute } from 'vue-router'
import { useVuelidate } from '@vuelidate/core'
import { isLaterThan } from '@/shared/utils/dateValidators'
import { required } from '@vuelidate/validators'
import { useAddressStore } from '@/entities/address'
import store from '@/store'

const DRAFT_KEY = 'downtimeFormDraft'

export interface DowntimeFormState {
  title: string | null
  truck: string | null
  type: string | null
  note: string | null
  partner: string | null
  address: string | null
  startPositionDate: string | null
  endPositionDate: string | null
  inOrderTime: boolean
}

interface UseFormProps {
  downtime?: DowntimeFormState | null
}

interface UseFormEmit {
  (event: 'submit', value: Record<string, unknown>): void
  (event: 'cancel'): void
}

interface UseFormReturn {
  state: Ref<DowntimeFormState>
  isInvalidForm: ComputedRef<boolean>
  resetForm: () => void
  submit: () => void
  cancel: () => void
  truckItems: ComputedRef<unknown[]>
  serviceAdressItems: ComputedRef<unknown[]>
  serviceItems: ComputedRef<unknown[]>
  downtimeTypes: ComputedRef<unknown[]>
  partnerContactsHint: ComputedRef<string | null>
}

export const useForm = (props: UseFormProps, emit: UseFormEmit): UseFormReturn => {
  const addressStore = useAddressStore()
  const route = useRoute()

  const initialState: DowntimeFormState = {
    title: null,
    truck: null,
    type: null,
    note: null,
    partner: null,
    address: null,
    startPositionDate: null,
    endPositionDate: null,
    inOrderTime: false,
  }

  let initialData: DowntimeFormState = props.downtime ? { ...props.downtime } : { ...initialState }

  const { newPartnerId, clearedPartner } = route.query
  if (newPartnerId || clearedPartner) {
    const raw = sessionStorage.getItem(DRAFT_KEY)
    if (raw) {
      try {
        initialData = { ...initialState, ...JSON.parse(raw) }
      } catch {
        /* игнорируем ошибки парсинга */
      }
    }
  }

  const state = ref<DowntimeFormState>(initialData)

  if (newPartnerId) state.value.partner = newPartnerId as string
  if (clearedPartner) state.value.partner = null

  const rules = {
    title: { required },
    truck: { required },
    type: { required },
    note: {},
    startPositionDate: { required },
    endPositionDate: {
      required,
      isLaterThan: isLaterThan(state.value.startPositionDate as string),
    },
  }

  const v$ = useVuelidate(rules, state)

  const isInvalidForm = computed(() => v$.value.$invalid as boolean)

  const truckItems = computed(() =>
    store.getters.trucks.filter((item: { type: string }) => item.type === 'truck')
  )

  const partnerContactsHint = computed(() => {
    if (!state.value.partner) return null
    const partner = store.getters.partnersMap.get(state.value.partner)
    if (!partner) return null
    return partner.contacts as string
  })

  const downtimeTypes = computed(() => store.getters.downtimeTypes)

  const serviceAdressItems = computed(() =>
    addressStore.addressesForAutocomplete.filter((i: { service: boolean }) => i.service)
  )

  const serviceItems = computed(() =>
    store.getters.partners
      .filter((i: { isService: boolean }) => i.isService)
      .map((i: { _id: string; name: string }) => ({ value: i._id, text: i.name }))
  )

  let draftTimer: ReturnType<typeof setTimeout> | undefined

  watch(
    state,
    (val) => {
      clearTimeout(draftTimer)
      draftTimer = setTimeout(() => {
        sessionStorage.setItem(DRAFT_KEY, JSON.stringify(val))
      }, 300)
    },
    { deep: true }
  )

  watch(
    () => route.query,
    (query) => {
      if (query.newPartnerId) state.value.partner = query.newPartnerId as string
      if (query.clearedPartner) state.value.partner = null
    }
  )

  function clearDraft() {
    sessionStorage.removeItem(DRAFT_KEY)
  }

  function resetForm() {
    state.value = { ...initialState }
  }

  function submit() {
    emit('submit', {
      ...state.value,
      company: store.getters.directoriesProfile,
    })
    clearDraft()
    resetForm()
  }

  function cancel() {
    clearDraft()
    resetForm()
    emit('cancel')
  }

  return {
    state,
    isInvalidForm,
    resetForm,
    submit,
    cancel,
    truckItems,
    serviceAdressItems,
    serviceItems,
    downtimeTypes,
    partnerContactsHint,
  }
}
