<template>
  <div v-if="!!clientVatRateInfo">
    <AppPriceWrapper
      v-if="showPriceBlock"
      v-model="prices"
      title="Стоимость рейса"
      :valid="isValidPrices"
      :readonly="readonlyPrice || disabledInPaymentInvoice"
      :agreement="agreement"
      :prePrices="prePrices"
      :vatRateInfo="clientVatRateInfo"
    />
    <AppPriceWrapper
      v-if="showOutsourceBlock"
      v-model="outsourceCosts"
      title="Затраты на привлеченного перевозчика"
      :readonly="readonlyCosts || hasIncomingInvoice"
      :agreement="carrierAgreement"
      :hidePrePrice="true"
      :vatRateInfo="carrierVatRateInfo"
      class="mt-2"
    />
    <slot v-if="showOutsourceBlock" />
  </div>
</template>
<script setup>
import { computed } from 'vue'
import { useStore } from 'vuex'
import AppPriceWrapper from './priceWrapper.vue'

defineOptions({ name: 'PriceBlock' })

const props = defineProps({
  hasIncomingInvoice: Boolean,
  disabledInPaymentInvoice: Boolean,
  prePrices: Array,
  route: Array,
  isValidPrices: {
    type: Boolean,
    default: true,
  },
  clientVatRateInfo: { type: Object },
  carrierVatRateInfo: { type: Object },
  agreement: Object,
  carrierAgreement: Object,
})

const prices = defineModel('prices', { type: Array })
const outsourceCosts = defineModel('outsourceCosts', { type: Array })

const store = useStore()

const lastDepartureDate = computed(() => {
  return props.route[props.route.length - 1].departureDate
})

const showPriceBlock = computed(() => {
  if (!lastDepartureDate.value)
    return props.agreement?.useCustomPrices && store.getters.hasPermission('order:daysForReadPrice')
  const hasReadPermission = store.getters.allowedPeriodForPermission({
    date: lastDepartureDate.value,
    permission: 'order:daysForReadPrice',
  })
  return props.agreement?.useCustomPrices && hasReadPermission
})

const showOutsourceBlock = computed(() => {
  return (
    !!props.carrierAgreement?._id &&
    store.getters.allowedPeriodForPermission({
      permission: 'order:daysForReadOutsourceCosts',
      date: lastDepartureDate.value,
    })
  )
})

const readonlyPrice = computed(() => {
  if (!lastDepartureDate.value) return !store.getters.hasPermission('order:daysForWritePrice')
  return !store.getters.allowedPeriodForPermission({
    permission: 'order:daysForWritePrice',
    date: lastDepartureDate.value,
  })
})

const readonlyCosts = computed(() => {
  return !store.getters.allowedPeriodForPermission({
    permission: 'order:daysForWriteOutsourceCosts',
    date: lastDepartureDate.value,
  })
})
</script>
