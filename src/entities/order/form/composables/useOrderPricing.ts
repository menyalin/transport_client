import { ref } from 'vue'

export function useOrderPricing() {
  const prices = ref<any[]>([])
  const prePrices = ref<any[]>([])
  const finalPrices = ref<any[]>([])
  const outsourceCosts = ref<any[]>([])

  function setPricing(val: Record<string, any>) {
    if (val.prices) prices.value = val.prices
    if (val.prePrices) prePrices.value = val.prePrices
    if (val.finalPrices) finalPrices.value = val.finalPrices
    if (val.outsourceCosts) outsourceCosts.value = val.outsourceCosts
  }

  function resetPricing() {
    prices.value = []
    prePrices.value = []
    finalPrices.value = []
    outsourceCosts.value = []
  }

  return {
    prices,
    prePrices,
    finalPrices,
    outsourceCosts,
    setPricing,
    resetPricing,
  }
}
