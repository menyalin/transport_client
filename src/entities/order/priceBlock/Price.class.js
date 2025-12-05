import store from '@/store/index'

class Price {
  constructor({ price, withVat, type, note, cashPayment }, vatRate) {
    const parsePrice = price => {
      const parsed = parseFloat(price)
      if (isNaN(parsed)) throw new Error('Invalid price value')
      return parsed
    }

    const calculatePrice = (price, withVat, vatRate) => {
      if (withVat) {
        return price
      } else {
        const vatAmount = price * vatRate * 0.01
        return price + vatAmount
      }
    }

    const calculatePriceWOVat = (price, withVat, vatRate) => {
      if (!withVat) {
        return price
      } else {
        const vatKoef = 1 + vatRate / 100
        return price / vatKoef
      }
    }

    const parsedVal = parsePrice(price)

    this.type = type
    this.note = note
    this.cashPayment = cashPayment

    this.priceWOVat = calculatePriceWOVat(parsedVal, withVat, vatRate)
    this.price = calculatePrice(parsedVal, withVat, vatRate)

    this.sumVat = this.price - this.priceWOVat
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
