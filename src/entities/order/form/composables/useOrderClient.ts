import { ref, computed } from 'vue'

export interface ClientVatRateInfo {
  date: string
  usePriceWithVat: boolean
  vatRate: number
}

export interface ClientInfo {
  client?: any
  agreement?: any
  clientVatRateInfo?: ClientVatRateInfo
  [key: string]: any
}

export function useOrderClient() {
  const agreement = ref<Record<string, any> | null>(null)
  const carrierAgreement = ref<Record<string, any> | null>(null)

  const client = ref<ClientInfo>({
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

  function setClient(val: Record<string, any>) {
    if (val.client) client.value = val.client
    if (val.agreement) agreement.value = val.agreement
  }

  function updateAgreement(agreementVal: Record<string, any>) {
    agreement.value = { ...agreementVal }
  }

  function updateCarrierAgreement(val: Record<string, any> | null) {
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
