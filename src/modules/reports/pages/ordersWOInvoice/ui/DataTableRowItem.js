import z from 'zod'
import store from '@/store'
import { utils } from './utis'
import { moneyFormatter } from '@/shared/utils/moneyFormatter'
export class DataTableRow {
  constructor(props) {
    DataTableRow.validationSchema.parse(props)
    this.orderId = props.orderId
    this.plannedDate = new Date(props.plannedDate)
    this.plannedDateStr = new Date(props.plannedDate).toLocaleString()
    this.orderTypeStr = store.getters.orderAnalyticTypesMap.get(
      props.analytics.type
    )
    this.tkNameStr =
      store.getters.tkNamesMap.get(props.confirmedCrew.tkName)?.name ||
      '__name not found__'
    this.truckNumStr = store.getters.trucksMap.get(
      props.confirmedCrew.truck
    )?.regNum

    this.trailerNumStr = store.getters.trucksMap.get(
      props.confirmedCrew.trailer
    )?.regNum

    this.driverFullName = store.getters.driversMap.get(
      props.confirmedCrew.driver
    )?.fullName

    this.clientName = store.getters.partnersMap.get(props.client.client)?.name
    this.clientNum = props.client.num
    this.clientAuctionNum = props.client.auctionNum
    this.loadingPoints = utils.getAddresses(
      props.route.filter((i) => i.type === 'loading').map((i) => i.address)
    )
    this.unloadingPoints = utils.getAddresses(
      props.route.filter((i) => i.type === 'unloading').map((i) => i.address)
    )
    this.docsStatusStr = utils.getDocsStatus(props.docs)
    this.itemType = utils.getItemTypeStr(props.itemType)
    this.basePriceWOvat = moneyFormatter(props.totalByTypes.base.priceWOVat)
    this.basePrice = moneyFormatter(props.totalByTypes.base.price)
    this.additionalPriceWOvat = moneyFormatter(
      props.total.priceWOVat - props.totalByTypes.base.priceWOVat
    )
    this.additionalPrice = moneyFormatter(
      props.total.price - props.totalByTypes.base.price
    )
    this.totalPriceWOvat = moneyFormatter(props.total.priceWOVat)
    this.totalPrice = moneyFormatter(props.total.price)
    this.agreementName = props.agreement.name
  }

  static get validationSchema() {
    return z.object({
      orderId: z.string(),
      plannedDate: z.string(),
      itemType: z.string(),
      route: z
        .object({
          type: z.string(),
          address: z.string(),
        })
        .array()
        .nonempty(),
      docs: z
        .object({
          addToRegistry: z.boolean(),
          status: z.string(),
        })
        .array()
        .optional(),
      client: z.object({
        client: z.string(),
        num: z.union([z.string(), z.nullable()]).optional(),
        auctionNum: z.union([z.string(), z.nullable()]).optional(),
      }),
      analytics: z.object({
        type: z.string(),
      }),
      confirmedCrew: z.object({
        tkName: z.string(),
        truck: z.string(),
        trailer: z.string().nullable(),
        driver: z.string(),
      }),
      total: z.object({
        price: z.number(),
        priceWOVat: z.number(),
      }),
      totalByTypes: z.object({
        base: z.object({
          price: z.number(),
          priceWOVat: z.number(),
        }),
      }),
    })
  }
}
