<template>
  <div>
    <v-table>
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
                  ? Intl.NumberFormat().format(prePricesMap.get(priceType.value)[priceField])
                  : '-'
              }}
            </td>
            <td class="text-right price-column">
              {{
                pricesMap.has(priceType.value)
                  ? Intl.NumberFormat().format(pricesMap.get(priceType.value)[priceField])
                  : '-'
              }}
            </td>
            <td class="text-right price-column">
              <input
                v-show="priceType.value === editableRowType"
                :ref="(el) => (inputRefs[priceType.value] = el)"
                :value="
                  finalPricesMap.has(priceType.value)
                    ? finalPricesMap.get(priceType.value)[priceField]
                    : null
                "
                class="input align-right"
                type="number"
                @blur="blurHandler"
                @change="changeFinalPrice($event, priceType.value)"
                @keypress.prevent.enter="changeFinalPrice($event, priceType.value)"
              />
              <div
                v-if="priceType.value !== editableRowType"
                :style="{ cursor: 'pointer' }"
                @click="editFinalPrice(priceType.value)"
              >
                {{
                  finalPricesMap.has(priceType.value)
                    ? Intl.NumberFormat().format(finalPricesMap.get(priceType.value)[priceField])
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
                      prePrices.reduce((sum, item) => (sum += item[priceField]), 0)
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
                      finalPrices.reduce((sum, item) => (sum += item[priceField]), 0)
                    )
                  : 0
              }}
            </th>
          </tr>
        </tbody>
      </template>
    </v-table>
  </div>
</template>

<script setup>
import { ref, computed, inject, nextTick, reactive } from 'vue'
import { useStore } from 'vuex'
import { Price } from '../priceBlock/Price.class'

defineOptions({ name: 'FinalPriceTable' })

const updateFinalPrices = inject('updateFinalPrices')

const props = defineProps({
  readonly: { type: Boolean, default: false },
  priceWithVat: { type: Boolean, default: true, required: true },
  prePrices: { type: Array },
  prices: { type: Array },
  finalPrices: { type: Array },
  agreementVatRate: { type: Number, required: true },
})

const store = useStore()

const editableRowType = ref(null)
const inputRefs = reactive({})

const orderPriceTypes = computed(() => store.getters.orderPriceTypes)

const prePricesMap = computed(() => {
  if (!props.prePrices) return new Map()
  return new Map(props.prePrices.map((item) => [item.type, item]))
})

const pricesMap = computed(() => {
  if (!props.prices) return new Map()
  return new Map(props.prices.map((item) => [item.type, item]))
})

const finalPricesMap = computed(() => {
  if (!props.finalPrices || props.finalPrices.length === 0) return new Map()
  return new Map(props.finalPrices.map((item) => [item.type, item]))
})

const priceField = computed(() => (props.priceWithVat ? 'price' : 'priceWOVat'))

function editFinalPrice(type) {
  if (props.readonly) return
  editableRowType.value = type
  nextTick(() => {
    inputRefs[type]?.focus()
  })
}

function blurHandler() {
  editableRowType.value = null
}

function changeFinalPrice(e, type) {
  const newFinalPrices = props.finalPrices.slice().filter((i) => i.type !== type)
  newFinalPrices.push({
    ...new Price(
      { price: e.target.value || 0, type },
      { vatRate: props.agreementVatRate, usePriceWithVat: props.priceWithVat }
    ),
  })
  updateFinalPrices(newFinalPrices)
  if (e.key === 'Enter') blurHandler()
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
