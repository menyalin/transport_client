<template>
  <v-dialog :value="dialog" max-width="800" @input="inputDialog">
    <v-card>
      <v-card-title>
        <div class="text-h6">Итоговые цены рейса</div>
        <v-spacer />
        <v-switch
          v-model="priceWithVat"
          class="mt-0 pt-0"
          label="Цены с НДС"
          dense
          hide-details
        />
      </v-card-title>

      <v-card-text>
        <app-final-price-table
          v-if="agreement"
          :prePrices="prePrices"
          :prices="order.prices"
          :priceWithVat="priceWithVat"
          :finalPrices="finalPrices"
          :agreementVatRate="agreement.vatRate"
        />
      </v-card-text>
      <v-card-actions>
        <v-btn small color="primary" text @click="getPrePrices">
          обновить предв. цены
        </v-btn>
        <v-btn
          small
          color="primary"
          text
          :disabled="setFinalPricesDisabled"
          @click="setFinalPrices"
        >
          Заполнить итоговые цены
        </v-btn>
        <v-spacer />

        <v-btn @click="cancel"> Отмена </v-btn>

        <v-btn
          color="primary"
          :disabled="saveBtnDisabled || !isChangedFinalPrices"
          :loading="loading"
          @click="save"
        >
          Сохранить
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
<script>

import { OrderService, TariffService } from '@/shared/services'
import appFinalPriceTable from './finalPriceTable.vue'

import DTO from '../priceBlock/Price.class'
import { mapGetters } from 'vuex'

export default {
  name: 'PriceDialog',
  inject: ['getOrderAgreement', 'updateFinalPrices'],
  components: {
    appFinalPriceTable,
  },
  props: {
    order: Object,
    dialog: Boolean,
    finalPrices: Array,
    prePrices: Array,
    agreementId: String,
  },
  data() {
    return {
      loading: false,
      agreement: {
        vatRate: 0,
      },
      priceWithVat: false,
    }
  },

  computed: {
    ...mapGetters(['orderPriceTypes']),
    setFinalPricesDisabled() {
      return !this.order.prePrices?.length && !this.order.prices?.length
    },
    saveBtnDisabled() {
      return (
        this.loading ||
        !this.$store.getters.hasPermission('order:writeFinalPrices')
      )
    },
    isChangedFinalPrices() {
      if (!Array.isArray(this.finalPrices) || this.finalPrices.length === 0)
        return false
      if (!Array.isArray(this.order.finalPrices) && this.finalPrices.length > 0)
        return true
      const orderFinalPricesMap = new Map(
        this.order.finalPrices.map((p) => [p.type, p.price])
      )
      const finalPricesMap = new Map(
        this.finalPrices.map((p) => [p.type, p.price])
      )
      return this.orderPriceTypes.some(
        ({ value }) =>
          orderFinalPricesMap.get(value) !== finalPricesMap.get(value)
      )
    },
  },
  watch: {
    agreementId: {
      immediate: true,
      handler: async function (val) {
        if (val) {
          this.agreement = await this.getOrderAgreement(val)
          if (this.agreement) this.priceWithVat = this.agreement.usePriceWithVAT
        } else this.agreement = null
      },
    },
  },
  methods: {
    async getPrePrices() {
      if (!this.order._id) {
        this.$store.commit(
          'setError',
          'Запрос цен возможен для сохраненного рейса'
        )
        return null
      }
      const data = await TariffService.getOrderPrePrices(
        DTO.prepareOrderForPrePriceQuery({
          ...this.order,
          orderId: this.order._id,
        })
      )
      if (data) {
        this.$emit('update:prePrices', data)
      }
    },
    inputDialog(val) {
      if (!val) this.cancel()
    },
    cancel() {
      this.$emit('update:dialog', false)
    },
    setFinalPrices() {
      const tmpFinalPrices = []
      this.orderPriceTypes.forEach((item) => {
        const priceType = item.value
        const price = this.order.prices.find((i) => i.type === priceType)
        const prePrice = this.prePrices.find((i) => i.type === priceType)

        if (price) tmpFinalPrices.push(price)
        else if (prePrice) tmpFinalPrices.push(prePrice)
      })
      this.updateFinalPrices(tmpFinalPrices)
    },

    async save() {
      try {
        this.loading = true
        await OrderService.updateFinalPrices({
          orderId: this.order._id,
          company: this.$store.getters.directoriesProfile,
          finalPrices: this.finalPrices,
        })
        this.loading = false
        this.$emit('update:dialog', false)
      } catch (e) {
        this.loading = false
        this.$store.commit('setError', e.message)
      }
    },
  },
}
</script>
