import { moneyFormatter } from '@/shared/utils/moneyFormatter'
import dayjs from 'dayjs'
import store from '@/store'
const DATE_FORMAT = 'DD.MM.YYYY'

const getPeriodDate = (orders, condFxName) => {
  const dates = orders.map((i) => dayjs(i.plannedDate))
  const targetDate = condFxName(...dates)
  return dayjs(targetDate).format(DATE_FORMAT)
}

const getInvoiceTotal = (orders) => {
  const result = orders.reduce(
    (res, item) => ({
      price: res.price + item.savedTotal.price,
      priceWOVat: res.priceWOVat + item.savedTotal.priceWOVat,
      vat: res.vat + (item.savedTotal.price - item.savedTotal.priceWOVat),
    }),
    { price: 0, priceWOVat: 0, vat: 0 }
  )

  return {
    price: moneyFormatter(result.price),
    priceWOVat: moneyFormatter(result.priceWOVat),
    vat: moneyFormatter(result.vat),
  }
}

const getAddressesByType = (route, pointType) => {
  const points = route
    .filter((i) => i.type === pointType)
    .reduce(
      (res, i) => (res.includes(i.address) ? res : res.concat([i.address])),
      []
    )
    .map((i) => store.getters.addressMap.get(i))
    .map((address) => ({
      ...address,
      _partner: store.getters.partnersMap.get(address.partner),
    }))
  return points
}

const getTruckType = (order) => {
  const tKind = store.getters.truckKindsMap.get(order.reqTransport.kind)
  return `${order.reqTransport.liftCapacity}т ${tKind}`
}

const getTtnNums = (order) =>
  order.docs
    .filter((d) => ['trn', 'ttn', 'torg'].includes(d.type) && !!d.number)
    .map((d) => d.number)
    .reduce((res, i) => (res.includes(i) ? res : res.concat([i])), [])
    .join(', ')

export class TemplateDataBuilder {
  constructor(invoice) {
    this.docNumber = invoice.number || 'б/н'
    this.sendDate = invoice.sendDate
      ? dayjs(invoice.sendDate).format(DATE_FORMAT)
      : ''
    this.startPeriodDate = getPeriodDate(invoice.orders, Math.min)
    this.endPeriodDate = getPeriodDate(invoice.orders, Math.max)
    this.total = getInvoiceTotal(invoice.orders)
    this.pO = invoice.orders.map((order, idx) => ({
      ...order,
      idx: idx + 1,
      auctionNum: order.client.auctionNum || '',
      num: order.client.num || '',
      truckNum:
        store.getters.trucksMap.get(order.confirmedCrew.truck).regNum || '',
      ttnNums: getTtnNums(order),
      orderDate: dayjs(order.plannedDate).format(DATE_FORMAT),
      orderTime: dayjs(order.plannedDate).format('HH:mm'),
      shippers: getAddressesByType(order.route, 'loading')
        .map((i) => i._partner.name)
        .join(', '),
      consignee: getAddressesByType(order.route, 'unloading')
        .map((i) => i._partner.name)
        .join(', '),
      loadPlaces: getAddressesByType(order.route, 'loading')
        .map((i) => i.name)
        .join(', '),
      unloadPlaces: getAddressesByType(order.route, 'unloading')
        .map((i) => i.name)
        .join(', '),
      truckType: getTruckType(order),
      total: {
        price: moneyFormatter(order.savedTotal.price),
        priceWOVat: moneyFormatter(order.savedTotal.priceWOVat),
      },
      base: {
        price: moneyFormatter(order.savedTotalByTypes.base.price),
        priceWOVat: moneyFormatter(order.savedTotalByTypes.base.priceWOVat),
      },
      // Простой на погрузке
      loadingD: {
        price: moneyFormatter(order.savedTotalByTypes.loadingDowntime.price),
        priceWOVat: moneyFormatter(
          order.savedTotalByTypes.loadingDowntime.priceWOVat
        ),
      },
      // Простой на разгрузке
      unloadingD: {
        price: moneyFormatter(order.savedTotalByTypes.unloadingDowntime.price),
        priceWOVat: moneyFormatter(
          order.savedTotalByTypes.unloadingDowntime.priceWOVat
        ),
      },
      returnP: {
        price: moneyFormatter(order.savedTotalByTypes.return.price),
        priceWOVat: moneyFormatter(order.savedTotalByTypes.return.priceWOVat),
      },
      additP: {
        price: moneyFormatter(order.savedTotalByTypes.additionalPoints.price),
        priceWOVat: moneyFormatter(
          order.savedTotalByTypes.additionalPoints.priceWOVat
        ),
      },
      otherP: {
        price: moneyFormatter(order.savedTotalByTypes.other.price),
        priceWOVat: moneyFormatter(order.savedTotalByTypes.other.priceWOVat),
      },
    }))
  }
}
