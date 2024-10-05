import { getCurrentInstance } from 'vue'

export const useAddress = () => {
  const { proxy } = getCurrentInstance()
  const { $router } = proxy
  return {
    actions: {
      create: ({ query }) => $router.push({ name: 'AddressCreate', query }),
      update: ({ id, query }) =>
        $router.push({ name: 'AddressDetails', params: { id }, query }),
    },
  }
}
