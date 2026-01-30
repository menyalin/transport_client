import store from '@/store/index'

export class Price {
  constructor({ price, type, note }, vatRateInfo = {}) {
    const parsePrice = (price) => {
      const parsed = parseFloat(price)
      if (isNaN(parsed)) throw new Error('Invalid price value')
      return parsed
    }

    // Расчет цены с НДС
    const calculatePrice = (price, withVat, vatRate) => {
      if (withVat) {
        // Входящая цена уже с НДС
        return price
      } else {
        // Входящая цена без НДС, добавляем НДС
        const vatAmount = (price * vatRate) / 100
        return price + vatAmount
      }
    }

    // Расчет цены без НДС
    const calculatePriceWOVat = (price, withVat, vatRate) => {
      if (!withVat) {
        // Входящая цена уже без НДС
        return price
      } else {
        // Входящая цена с НДС, вычисляем цену без НДС
        const vatKoef = 1 + vatRate / 100
        return price / vatKoef
      }
    }

    const parsedVal = parsePrice(price)

    this.type = type
    this.note = note
    this.priceWOVat = calculatePriceWOVat(
      parsedVal,
      vatRateInfo.usePriceWithVat,
      vatRateInfo.vatRate
    )
    this.price = calculatePrice(
      parsedVal,
      vatRateInfo.usePriceWithVat,
      vatRateInfo.vatRate
    )

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
