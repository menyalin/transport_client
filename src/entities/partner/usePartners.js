import store from '@/store'

export const usePartners = () => {
  return {
    allPartners: store.getters.partners,
    clients: store.getters.partners.filter((i) => i.isClient),
  }
}
