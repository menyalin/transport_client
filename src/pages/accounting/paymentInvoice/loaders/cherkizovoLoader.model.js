import { z } from 'zod'
import { PaymentInvoiceService } from '@/shared/services'

const ParsedOrderDTOSchema = z.object({
  num: z.union([z.string(), z.number()]),
  truck: z.string(),
  driver: z.string(),
  priceWOVat: z.number(),
  vat: z.number(),
  price: z.number(),
})

const PickOrdersByClientNumbersPropsSchema = z.object({
  period: z.string().datetime().array().length(2),
  company: z.string(),
  client: z.string(),
  agreement: z.string(),
  numbers: z.string().array().nonempty({
    message: 'Cant be empty!',
  }),
})

export class ParsedOrderDTO {
  constructor(item) {
    ParsedOrderDTOSchema.parse(item)
    this.num = item.num.toString()
    this.truck = item.truck
    this.driver = item.driver
    this.priceWOVat = item.priceWOVat
    this.vat = item.vat
    this.price = item.price
  }
}

export const usePageData = () => {
  async function pickOrdersByClientNumbers(props) {
    PickOrdersByClientNumbersPropsSchema.parse(props)
    const orders = await PaymentInvoiceService.pickOrders(props)
    return orders
  }

  return {
    pickOrdersByClientNumbers,
  }
}
