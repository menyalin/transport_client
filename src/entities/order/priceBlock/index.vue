<template>
  <div>
    <app-price-wrapper
      v-if="showPriceBlock"
      :items="prices"
      :isValid="isValidPrices"
      :readonly="readonlyPrice || hasPaymentInvoice"
      :agreement="agreement"
      title="Стоимость рейса"
      :prePrices="prePrices"
      @update:model-value="changePricesHandler"
    />
    <app-price-wrapper
      v-if="showOutsourceBlock"
      :items="outsourceCosts"
      class="mt-4"
      :readonly="readonlyCosts || hasIncomingInvoice"
      :agreement="carrierAgreement"
      title="Затраты на привлеченного перевозчика"
      :hidePrePrice="true"
      @update:model-value="changeOutsourceCostsHandler"
    />
    <slot v-if="showOutsourceBlock" />
  </div>
</template>
<script>
import AppPriceWrapper from './priceWrapper.vue'

export default {
  name: 'PriceBlock',
  components: {
    AppPriceWrapper,
  },
  props: {
    hasIncomingInvoice: Boolean,
    hasPaymentInvoice: Boolean,
    prePrices: Array,
    route: Array,
    isValidPrices: {
      type: Boolean,
      default: true,
    },
    prices: Array,
    outsourceCosts: Array,
    agreement: Object,
    carrierAgreement: Object,
  },
  data() {
    return {
      tmpCosts: [],
    }
  },
  computed: {
    lastDepartureDate() {
      return this.route[this.route.length - 1].departureDate
    },
    showPriceBlock() {
      const lastDepartureDate = this.route[this.route.length - 1].departureDate
      if (!lastDepartureDate)
        return (
          this.agreement?.useCustomPrices &&
          this.$store.getters.hasPermission('order:daysForReadPrice')
        )
      const hasReadPermission = this.$store.getters.allowedPeriodForPermission({
        date: lastDepartureDate,
        permission: 'order:daysForReadPrice',
      })
      return this.agreement?.useCustomPrices && hasReadPermission
    },
    showOutsourceBlock() {
      return (
        !!this.carrierAgreement?._id &&
        this.$store.getters.allowedPeriodForPermission({
          permission: 'order:daysForReadOutsourceCosts',
          date: this.lastDepartureDate,
        })
      )
    },
    readonlyPrice() {
      const lastDepartureDate = this.route[this.route.length - 1].departureDate
      if (!lastDepartureDate)
        return !this.$store.getters.hasPermission('order:daysForWritePrice')
      else
        return !this.$store.getters.allowedPeriodForPermission({
          permission: 'order:daysForWritePrice',
          date: lastDepartureDate,
        })
    },
    readonlyCosts() {
      return !this.$store.getters.allowedPeriodForPermission({
        permission: 'order:daysForWriteOutsourceCosts',
        date: this.lastDepartureDate,
      })
    },
  },
  watch: {
    outsourceCosts: {
      immediate: true,
      handler: function (val) {
        if (val) this.tmpCosts = val
      },
    },
    tmpCosts: {
      deep: true,
      handler: function (val) {
        this.$emit('outsource-costs:update', val)
      },
    },
  },
  methods: {
    changePricesHandler(prices) {
      this.$emit('update:prices', prices)
    },
    changeOutsourceCostsHandler(costs) {
      this.$emit('update:outsourceCosts', costs)
    },
  },
}
</script>
