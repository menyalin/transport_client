<template>
  <div>
    <v-simple-table dense>
      <template #default>
        <thead>
          <tr>
            <th class="text-center">Тип тарифа</th>
            <th class="text-center">Предварительные цены</th>
            <th class="text-center">Аукционная цена</th>
            <th class="text-center">Итоговые</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="priceType of orderPriceTypes" :key="priceType.value">
            <td>{{ priceType.text }}</td>
            <td class="text-right price-column">
              {{
                prePricesMap.has(priceType.value)
                  ? Intl.NumberFormat().format(
                    prePricesMap.get(priceType.value)[priceField]
                  )
                  : '-'
              }}
            </td>
            <td class="text-right price-column">
              {{
                pricesMap.has(priceType.value)
                  ? Intl.NumberFormat().format(
                    pricesMap.get(priceType.value)[priceField]
                  )
                  : '-'
              }}
            </td>
            <td class="text-right price-column">
              <input
                v-show="priceType.value === editableRowType"
                :ref="priceType.value"
                :value="
                  finalPricesMap.has(priceType.value)
                    ? finalPricesMap.get(priceType.value)[priceField]
                    : null
                "
                class="input"
                align="right"
                type="number"
                @blur="blurHandler"
                @change="changeFinalPrice($event, priceType.value)"
                @keypress.prevent.enter="
                  changeFinalPrice($event, priceType.value)
                "
              />
              <div
                v-if="priceType.value !== editableRowType"
                :style="{ cursor: 'pointer' }"
                @click="editFinalPrice(priceType.value)"
              >
                {{
                  finalPricesMap.has(priceType.value)
                    ? Intl.NumberFormat().format(
                      finalPricesMap.get(priceType.value)[priceField]
                    )
                    : '-'
                }}
              </div>
            </td>
          </tr>

          <tr>
            <th>Итого:</th>
            <th class="text-right">
              {{
                Array.isArray(prePrices)
                  ? Intl.NumberFormat().format(
                    prePrices.reduce(
                      (sum, item) => (sum += item[priceField]),
                      0
                    )
                  )
                  : 0
              }}
            </th>
            <th class="text-right">
              {{
                Array.isArray(prices)
                  ? Intl.NumberFormat().format(
                    prices.reduce((sum, item) => (sum += item[priceField]), 0)
                  )
                  : 0
              }}
            </th>
            <th class="text-right">
              {{
                Array.isArray(finalPrices)
                  ? Intl.NumberFormat().format(
                    finalPrices.reduce(
                      (sum, item) => (sum += item[priceField]),
                      0
                    )
                  )
                  : 0
              }}
            </th>
          </tr>
        </tbody>
      </template>
    </v-simple-table>
  </div>
</template>
<script>
import { mapGetters } from 'vuex'
import Price from '../priceBlock/Price.class'
export default {
  name: 'FinalPriceTable',
  inject: ['updateFinalPrices'],
  props: {
    priceWithVat: { type: Boolean, default: true, required: true },
    prePrices: { type: Array },
    prices: { type: Array },
    finalPrices: { type: Array },
    agreementVatRate: { type: Number, required: true },
  },
  data() {
    return {
      editableRowType: null,
    }
  },
  computed: {
    ...mapGetters(['orderPriceTypes']),
    prePricesMap() {
      if (!this.prePrices) return new Map()
      return new Map(this.prePrices.map((item) => [item.type, item]))
    },
    pricesMap() {
      if (!this.prices) return new Map()
      return new Map(this.prices.map((item) => [item.type, item]))
    },
    finalPricesMap() {
      if (this.finalPrices.length === 0) return new Map()
      return new Map(this.finalPrices.map((item) => [item.type, item]))
    },
    priceField() {
      if (this.priceWithVat) return 'price'
      return 'priceWOVat'
    },
  },
  methods: {
    editFinalPrice(type) {
      this.editableRowType = type
      this.$nextTick(() => {
        this.$refs[this.editableRowType][0].focus()
      })
    },
    blurHandler() {
      this.editableRowType = null
    },
    changeFinalPrice(e, type) {
      const newFinalPrices = this.finalPrices
        .slice()
        .filter((i) => i.type !== type)
      newFinalPrices.push({
        ...new Price(
          { price: e.target.value || 0, withVat: this.priceWithVat, type },
          this.agreementVatRate
        ),
      })
      this.updateFinalPrices(newFinalPrices)
      if (e.key === 'Enter') this.blurHandler()
    },
  },
}
</script>
<style scoped>
.input {
  width: 100%;
  text-align: right;
}
.price-column {
  width: 7rem;
}
</style>
