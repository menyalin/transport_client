export interface PriceValueInput {
  price: number | string
  withVat: boolean
  vatRate: number
}

export class PriceValue {
  priceWOVat: number
  sumVat: number
  price: number

  constructor({ price, withVat, vatRate }: PriceValueInput) {
    const parsedVal = parseFloat(String(price))
    const vatKoef = parseFloat(String(1 + vatRate / 100))
    this.priceWOVat = withVat ? parsedVal / vatKoef : parsedVal
    this.sumVat = withVat ? parsedVal - parsedVal / vatKoef : parsedVal * ((vatKoef * 10 - 10) / 10)
    this.price = withVat ? parsedVal : parsedVal + parsedVal * ((vatKoef * 10 - 10) / 10)
  }
}
