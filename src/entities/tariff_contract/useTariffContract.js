import store from '@/store'
import { TariffContractService } from '@/shared/services'

export const useTariffContract = () => {
  async function create(contractBody) {
    const res = await TariffContractService.create({
      ...contractBody,
      company: store.getters.directoriesProfile,
    })
    return res
  }

  async function getById(id) {
    const contract = await TariffContractService.getById(id)
    return contract
  }

  async function getList(listOptions) {
    const res = await TariffContractService.getList(listOptions)
    return res
  }

  async function updateOne(id, body) {
    const res = await TariffContractService.updateOne(id, body)
    return res
  }

  async function deleteById(id) {
    const res = await TariffContractService.deleteById(id)
    return res
  }

  return {
    create,
    getById,
    updateOne,
    getList,
    deleteById,
  }
}
