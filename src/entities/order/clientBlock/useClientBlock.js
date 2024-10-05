import store from '@/store/index'

export const useClientBlock = () => {
  return {
    clientItems: store.getters.partners
      .filter((p) => p.isClient)
      .map((i) => ({ value: i._id, text: i.name })),
  }
}
