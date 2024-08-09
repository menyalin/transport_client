export class Price {
  constructor(price = 0, withVat, currency = 'RUB') {
    this.price = price
    this.withVat = withVat
    this.currency = currency
  }
}
