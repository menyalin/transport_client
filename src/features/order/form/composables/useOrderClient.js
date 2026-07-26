import { ref, computed } from 'vue'

export function useOrderClient() {
  const agreement = ref(null)
  const carrierAgreement = ref(null)

  const client = ref({
    client: null,
    agreement: null,
    clientVatRateInfo: {
      date: new Date().toISOString(),
      usePriceWithVat: false,
      vatRate: 0,
    },
  })

  const isValidClientInfo = computed(() => {
    return !!client.value?.client
  })

  const clientAgreement = computed(() => {
    return client.value?.agreement
  })

  function setClient(val) {
    if (val.client) client.value = val.client
    if (val.agreement) agreement.value = val.agreement
  }

  function updateAgreement(agreementVal) {
    agreement.value = { ...agreementVal }
  }

  function updateCarrierAgreement(val) {
    carrierAgreement.value = val
  }

  function resetClient() {
    client.value = { ...{} }
    agreement.value = null
    carrierAgreement.value = null
  }

  return {
    agreement,
    carrierAgreement,
    client,
    isValidClientInfo,
    clientAgreement,
    setClient,
    updateAgreement,
    updateCarrierAgreement,
    resetClient,
  }
}
