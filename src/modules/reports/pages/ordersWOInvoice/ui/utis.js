import z from 'zod'
import store from '@/store'

const getddressPropSchema = z.string().array().nonempty()

const getAddresses = (addresses = []) => {
  getddressPropSchema.parse(addresses)
  const res = []
  addresses.forEach((address) => {
    res.push(store.getters.addressMap.get(address)?.shortName)
  })
  return res.filter(Boolean).join(', ')
}

const getDocsStatus = (docs = []) => {
  const docsForRegistry = docs
    .filter((doc) => doc.addToRegistry)
    .map((i) => i.status)
  if (docsForRegistry.every((status) => status === 'accepted')) return 'Приняты'
  if (docsForRegistry.some((status) => status === 'needFix'))
    return 'На исправлении'
  return 'Не приняты'
}

const getItemTypeStr = (itemType) => {
  if (!['order', 'paymentPart'].includes(itemType))
    throw new Error('Тип записи не известен!')
  return itemType === 'order' ? 'Рейс' : 'Часть рейса'
}

export const utils = {
  getAddresses,
  getDocsStatus,
  getItemTypeStr,
}
