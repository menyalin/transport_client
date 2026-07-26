import { usePartnerStore } from './usePartnerStore'

export const usePartners = () => {
  const store = usePartnerStore()
  return {
    allPartners: store.allPartners,
    clients: store.clients,
  }
}
