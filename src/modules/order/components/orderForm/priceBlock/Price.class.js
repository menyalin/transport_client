import store from '@/store/index'

class Price {
  constructor({ price, withVat, type, note, cashPayment }, vatRate) {
    let parsedVal = parseFloat(price)
    if (isNaN(parsedVal)) throw new Error('invalid price value')
    const vatKoef = parseFloat(1 + vatRate / 100)
    const tmpPrice = withVat
      ? parsedVal
      : parsedVal + parsedVal * vatRate * 0.01
    const tmpPriceWOVat = withVat ? parsedVal / vatKoef : parsedVal

    this.type = type
    this.note = note
    this.cashPayment = cashPayment

    this.priceWOVat = Math.round(tmpPriceWOVat * 100) / 100
    this.price = Math.round(tmpPrice * 100) / 100

    this.sumVat = Math.round((this.price - this.priceWOVat) * 100) / 100
  }

  static prepareOrderForPrePriceQuery(order) {
    return {
      company: store.getters.directoriesProfile,
      date: new Date(order.route[0].plannedDate).toISOString(),
      agreement: order.client.agreement,
      truckKind: order.reqTransport.kind,
      liftCapacity: order.reqTransport.liftCapacity,
      route: order.route,
      orderType: order.analytics.type,
      prices: order.prices,
      analytics: order.analytics,
    }
  }
}

export default Price
