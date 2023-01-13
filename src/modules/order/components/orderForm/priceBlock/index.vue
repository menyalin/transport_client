<template>
  <div>
    <app-price-wrapper
      v-if="showPriceBlock"
      v-model="tmpPrices"
      :isValid="isValidPrices"
      :readonly="readonlyPrice"
      :agreement="agreement"
      title="Стоимость рейса"
    />
    <app-price-wrapper
      v-if="showOutsourceBlock"
      v-model="tmpCosts"
      class="mt-4"
      :readonly="readonlyCosts"
      :agreement="outsourceAgreement"
      title="Затраты на привлеченного перевозчика"
    />
  </div>
</template>
<script>
import AppPriceWrapper from './priceWrapper.vue'
import { AgreementService } from '@/shared/services'

export default {
  name: 'PriceBlock',
  components: {
    AppPriceWrapper,
  },
  props: {
    route: Array,
    isValidPrices: {
      type: Boolean,
      default: true,
    },
    prices: Array,
    outsourceCosts: Array,
    agreementId: String,
    outsourceAgreementId: String,
  },
  data() {
    return {
      agreement: {},
      outsourceAgreement: {},
      tmpPrices: [],
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
          this.agreement.useCustomPrices &&
          this.$store.getters.hasPermission('order:daysForReadPrice')
        )
      const hasReadPermission = this.$store.getters.allowedPeriodForPermission({
        date: lastDepartureDate,
        permission: 'order:daysForReadPrice',
      })
      return this.agreement.useCustomPrices && hasReadPermission
    },
    showOutsourceBlock() {
      return (
        !!this.outsourceAgreementId &&
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
    prices: {
      immediate: true,
      handler: function (val) {
        if (val) this.tmpPrices = val
      },
    },
    tmpPrices: {
      deep: true,
      handler: function (val) {
        this.$emit('prices:update', val)
      },
    },
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
    agreementId: {
      immediate: true,
      handler: async function (val) {
        if (val) this.agreement = await AgreementService.getById(val)
        else this.agreement = { ...{} }
      },
    },
    outsourceAgreementId: {
      immediate: true,
      handler: async function (val) {
        if (val) this.outsourceAgreement = await AgreementService.getById(val)
        else this.outsourceAgreement = { ...{} }
      },
    },
  },
}
</script>
<style></style>
