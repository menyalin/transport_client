import z from 'zod'
import store from '@/store'
import { computed, ref, watch } from 'vue'
import { required, minValue } from '@vuelidate/validators'
import { useVuelidate } from '@vuelidate/core'
import { AgreementService } from '@/shared/services/index'
import { VAT_RATE_ITEMS } from '@/shared/constants/vatRates'

const PaymentPartValidationSchema = z.object({
  client: z.string().optional(),
  agreement: z.string().optional(),
  sum: z.number(),
  vatRate: z.number(),
  sumWithVAT: z.boolean(),
  type: z.string().optional().nullable(),
  note: z.string().optional(),
})

class PaymentPart {
  constructor(data) {
    try {
      PaymentPartValidationSchema.safeParse(data)

      if (!VAT_RATE_ITEMS.map(i => i.value).includes(data.vatRate))
        throw new Error('PaymentPart : constructor : invalid vatRate param')

      this.client = data.client
      this.agreement = data.agreement
      this.type = data.type || 'part'
      this.note = data.note

      if (data.vatRate === 0) {
        this.price = data.sum
        this.priceWOVat = data.sum
        this.sumVat = 0
      } else {
        const vatMultiplier = data.vatRate / 100

        if (data.sumWithVAT) {
          this.price = data.sum
          this.priceWOVat = data.sum / (1 + vatMultiplier)
        } else {
          this.priceWOVat = data.sum
          this.price = data.sum * (1 + vatMultiplier)
        }
        this.sumVat = this.price - this.priceWOVat
      }
    } catch (e) {
      console.error(e)
    }
  }
}

export function usePaymentPartForm({ routeDate }, ctx) {
  if (!routeDate) console.warn('-->> route date is required!!!')

  const agreements = ref([])
  const initialState = {
    client: null,
    agreement: null,
    sumWithVAT: false,
    sum: 0,
  }

  const state = ref(initialState)

  const rules = {
    client: { required },
    agreement: { required },
    sum: { required, minValue: minValue(1) },
    sumWithVAT: { required },
    note: {},
  }
  const invalidForm = computed(() => v$.value.$invalid)
  const v$ = useVuelidate(rules, state)

  const clientItems = computed(() => store.getters.partners.filter(i => i.isClient))

  async function setAgreement({ client, routeDate }) {
    const res = await AgreementService.getForClient({
      client,
      date: routeDate,
      company: store.getters.directoriesProfile,
    })

    if (res) agreements.value = res
    const [firstAgreement] = res

    if (firstAgreement) state.value.sumWithVAT = firstAgreement.usePriceWithVAT

    if (firstAgreement && !state.value.agreement) state.value.agreement = firstAgreement._id
  }

  const agreement = computed(() => {
    if (agreements.value.length === 0) return {}
    if (!state.value.agreement) return {}
    else return agreements.value.find(i => i._id === state.value.agreement)
  })

  const agreementItems = computed(() => agreements.value.sort((a, b) => (a.name > b.name ? 1 : -1)) || [])

  const vatCheckboxIsDisabled = computed(() => {
    return !agreement.value?.vatRate
  })

  const sumFieldIsDisabled = computed(() => !state.value?.agreement)

  const vatRate = computed(() => agreement.value?.vatRate)

  function submitHandler() {
    try {
      const submitedData = new PaymentPart({
        ...state.value,
        vatRate: agreement.value.vatRate,
      })

      ctx.emit('submit', submitedData)
    } catch (e) {
      console.log(e)
    }
  }

  watch(state, (newVal, oldVal) => {
    if (newVal.agreement !== oldVal.agreement) console.log('agreement changed: ', newVal)
  })

  watch([() => routeDate, () => state.value.client], async ([routeDate, client]) => {
    await setAgreement({ client, routeDate })
  })

  watch(vatRate, val => {
    if (val === 0) state.value.sumWithVAT = false
  })

  return {
    v$,
    state,
    clientItems,
    invalidForm,
    agreementItems,
    agreements,
    vatCheckboxIsDisabled,
    sumFieldIsDisabled,
    vatRate,
    submitHandler,
  }
}
