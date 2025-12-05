export class PriceValue {
  constructor({ price, withVat, vatRate }) {
    const parsedVal = parseFloat(price)
    const vatKoef = parseFloat(1 + vatRate / 100)
    this.priceWOVat = withVat ? parsedVal / vatKoef : parsedVal
    this.sumVat = withVat ? parsedVal - parsedVal / vatKoef : parsedVal * ((vatKoef * 10 - 10) / 10)
    this.price = withVat ? parsedVal : parsedVal + parsedVal * ((vatKoef * 10 - 10) / 10)
  }
}
