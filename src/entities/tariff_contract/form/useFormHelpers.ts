import { minLength, required } from '@vuelidate/validators'
import { computed, ref } from 'vue'

import store from '@/store'

export const useFormHelpers = () => {
  const focusableNodeRef = ref(null)
  const commonRules = {
    truckKinds: { required, minLength: minLength(1) },
    liftCapacities: { required, minLength: minLength(1) },
  }
  const zoneItems = computed(() => store.getters.zones)
  const truckKindItems = computed(() => store.getters.truckKinds)
  const liftCapacityItems = computed(() => store.getters.liftCapacityTypes)
  const orderTypeItems = computed(() => store.getters.orderAnalyticTypes)
  const tariffByItems = computed(() => store.getters.waitingTariffByItems)
  const roundingIntervalItems = computed(
    () => store.getters.idleTimeRoundingIntervals
  )

  return {
    focusableNodeRef,
    truckKindItems,
    liftCapacityItems,
    orderTypeItems,
    commonRules,
    tariffByItems,
    roundingIntervalItems,
    zoneItems,
  }
}
