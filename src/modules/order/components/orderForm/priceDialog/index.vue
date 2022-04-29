<template>
  <v-dialog
    :value="dialog"
    max-width="800"
    @input="inputDialog"
  >
    <v-card>
      <v-card-title>
        <div class="text-h6">
          Итоговые цены рейса
        </div>
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
          :prePrices="prePrices"
          :prices="order.prices"
          :priceWithVat="priceWithVat"
          :finalPrices="order.finalPrices"
          :agreementVatRate="20"
        />
      </v-card-text>
      <v-card-actions>
        <v-btn @click="getPrePrices">
          Обновить цены
        </v-btn>
        <v-spacer />

        <v-btn @click="cancel">
          Отмена
        </v-btn>

        <v-btn
          color="primary"
          @click="save"
        >
          Сохранить
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
<script>
import tariffService from '@/modules/profile/services/tariff.service'
import appFinalPriceTable from './finalPriceTable.vue'

import DTO from '../priceBlock/Price.class'

export default {
  name: 'PriceDialog',
  components: {
    appFinalPriceTable,
  },
  props: {
    order: Object,
    dialog: Boolean,
    prePrices: Array,
    agreementVatRate: { type: Number, required: true },
  },
  data() {
    return {
      priceWithVat: false,
    }
  },
  methods: {
    async getPrePrices() {
      const data = await tariffService.getOrderPrePrices(
        DTO.prepareOrderForPrePriceQuery(this.order)
      )
      if (data) this.$emit('update:prePrices', data)
    },
    inputDialog(val) {
      if (!val) this.cancel()
    },
    cancel() {
      this.$emit('update:dialog', false)
    },
    save() {
      this.$emit('update:dialog', false)
    },
  },
}
</script>
