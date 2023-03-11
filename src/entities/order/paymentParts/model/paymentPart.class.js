import { PriceValue } from '@/shared/values'

/*----------------------------------------------------------------
const paymentPart = {
  client: { type: Types.ObjectId, ref: 'Partner', required: true },
  agreement: { type: Types.ObjectId, ref: 'Agreement', required: true },
  note: String,
  ...PriceDTO.modelFields(),
}
*/

export class PaymentPart {
  constructor({ sum, sumWithVAT, vatRate, client, agreement, note }) {
    const priceValue = new PriceValue({
      price: sum,
      withVat: sumWithVAT,
      vatRate: vatRate,
    })
    this.type = 'part'
    this.client = client
    this.agreement = agreement
    this.note = note

    const keys = Object.keys(priceValue)
    keys.forEach((key) => {
      this[key] = priceValue[key]
    })
  }
}
