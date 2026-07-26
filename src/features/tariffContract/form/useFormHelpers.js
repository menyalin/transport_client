import store from '@/store'
import { useOrderStore } from '@/entities/order/orderStore'
import { ref, computed } from 'vue'
import { required, minLength } from '@vuelidate/validators'

export const useFormHelpers = () => {
  const orderStore = useOrderStore()
  const focusableNodeRef = ref(null)
  const commonRules = {
    truckKinds: { required, minLength: minLength(1) },
    liftCapacities: { required, minLength: minLength(1) },
  }
  const zoneItems = computed(() => store.getters.zones)
  const truckKindItems = computed(() => store.getters.truckKinds)
  const liftCapacityItems = computed(() => store.getters.liftCapacityTypes)
  const orderTypeItems = computed(() => orderStore.orderAnalyticTypes)
  const tariffByItems = computed(() => store.getters.waitingTariffByItems)
  const roundingIntervalItems = computed(() => store.getters.idleTimeRoundingIntervals)

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
