import store from '@/store'
import { computed, ref, watch } from 'vue'
import { required, minValue } from '@vuelidate/validators'
import { useVuelidate } from '@vuelidate/core'
import { AgreementService } from '@/shared/services/index'

export function usePaymentPartForm({ routeDate }) {
  if (!routeDate) console.warn('-->> route date is required!!!')
  const agreement = ref({})
  const agreements = ref([])
  const state = ref({
    client: null,
    agreement: null,
    sumWithVAT: false,
    sum: 0,
  })

  const rules = {
    client: { required },
    agreement: { required },
    sum: { required, minValue: minValue(1) },
    sumWithVAT: { required },
    note: {},
  }
  const invalidForm = computed(() => v$.value.$invalid)
  const v$ = useVuelidate(rules, state)

  const clientItems = computed(() =>
    store.getters.partners.filter((i) => i.isClient)
  )

  async function setAgreement({ client, routeDate }) {
    agreements.value = await AgreementService.getForClient({
      client,
      date: routeDate,
      company: store.getters.directoriesProfile,
    })

    if (agreements.value.length === 1) {
      agreement.value = agreements.value[0]
      // state.value.agreement = agreement.value[0]._id
      // state.value.sumWithVAT = !!agreement.value[0].vatRate
    }
  }

  const vatCheckboxIsDisabled = computed(() => {
    return !agreement.value?.vatRate
  })

  const sumFieldIsDisabled = computed(() => !state.value?.agreement)

  const vatRate = computed(() => agreement.value.vatRate)

  watch(state, (newVal, oldVal) => {
    if (newVal.agreement !== oldVal.agreement)
      console.log('agreement changed: ', newVal)
  })

  watch(
    [() => routeDate, () => state.value.client],
    async ([routeDate, client]) => {
      await setAgreement({ client, routeDate })
    }
  )
  return {
    v$,
    state,
    invalidForm,
    clientItems,
    agreements,
    vatCheckboxIsDisabled,
    sumFieldIsDisabled,
    vatRate,
  }
}
