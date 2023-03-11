import store from '@/store'
import { computed, ref, watch } from 'vue'
import { required, minValue } from '@vuelidate/validators'
import { useVuelidate } from '@vuelidate/core'
import { AgreementService } from '@/shared/services/index'

export function usePaymentPartForm({ routeDate }) {
  if (!routeDate) console.warn('-->> route date is required!!!')
  const agreement = ref({})

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
    agreement.value = await AgreementService.getForOrder({
      client,
      date: routeDate,
      company: store.getters.directoriesProfile,
    })
    if (agreement.value) {
      state.value.agreement = agreement.value._id
      state.value.sumWithVAT = !!agreement.value.vatRate
    }
  }
  const agreementItems = computed(() => {
    if (agreement.value) return [agreement.value]
    else return []
  })

  const vatCheckboxIsDisabled = computed(() => {
    return !agreement.value?.vatRate
  })

  const sumFieldIsDisabled = computed(() => !state.value?.agreement)

  const vatRate = computed(() => agreement.value.vatRate)

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
    agreementItems,
    vatCheckboxIsDisabled,
    sumFieldIsDisabled,
    vatRate,
  }
}
