import router from '@/router/index'
import store from '@/store'

export const usePartners = () => {
  return {
    allPartners: store.getters.partners,
    clients: store.getters.partners.filter((i) => i.isClient),
    actions: {
      create: ({ query }) => router.push({ name: 'PartnerCreate', query }),
      update: ({ id, query }) =>
        router.push({ name: 'PartnerDetails', params: { id }, query }),
    },
  }
}
