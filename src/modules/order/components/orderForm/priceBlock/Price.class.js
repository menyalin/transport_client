class Price {
  constructor({ price, withVat, type, note, cashPayment }, vatRate) {
    const parsedVal = parseFloat(price)
    const vatKoef = parseFloat(1 + vatRate / 100)
    this.type = type
    this.note = note
    this.cashPayment = cashPayment
    this.priceWOVat = withVat ? parsedVal / vatKoef : parsedVal
    this.sumVat = withVat
      ? parsedVal - parsedVal / vatKoef
      : parsedVal * ((vatKoef * 10 - 10) / 10)
    this.price = withVat
      ? parsedVal
      : parsedVal + parsedVal * ((vatKoef * 10 - 10) / 10)
  }
}

export default Price
