import { z } from 'zod'
import { PaymentInvoiceService } from '@/shared/services'
import store from '@/store/index'

const PickOrdersByClientNumbersPropsSchema = z.object({
  period: z.string().datetime().array().length(2),
  paymentInvoiceId: z.string(),
  company: z.string(),
  client: z.string(),
  agreement: z.string(),
  numbers: z.string().array().nonempty({
    message: 'Cant be empty!',
  }),
})

const truckTypeMapper = {
  '5т': {
    liftCapacity: 5,
    kind: 'ref',
  },
  '10т': {
    liftCapacity: 10,
    kind: 'ref',
  },
  '20т': {
    liftCapacity: 20,
    kind: 'ref',
  },
  '20т DD': {
    liftCapacity: 20,
    kind: 'refD',
  },
}

const ParsedOrderDTOSchema = z.object({
  num: z.union([z.string(), z.number()]),
  truck: z.string(),
  route: z.string(),
  driver: z.string(),
  priceWOVat: z.number(),
  vat: z.number(),
  price: z.number(),
  truckType: z
    .string()
    .refine((value) => Object.keys(truckTypeMapper).includes(value), {
      message: (value) => `Invalid transport type: ${value}`,
    }),
})

export class ParsedOrderDTO {
  constructor(item) {
    ParsedOrderDTOSchema.parse(item)
    this.num = item.num.toString()
    this.truck = item.truck
    this.driver = item.driver
    this.route = item.route
    this.priceWOVat = item.priceWOVat
    this.vat = item.vat
    this.price = item.price
    this.truckType = item.truckType
  }
}

const compareItemSchema = z.object({
  _id: z.string().optional(),
  isOrderPicked: z.boolean(),
  clientNum: z.string(),
  route: z.string(),
  uploadedTruckNumber: z.string(),
  uploadedDriverName: z.string(),
  uploadedTruckType: z.string(),
  uploadedPrices: z.object({
    price: z.number(),
    vat: z.number(),
    priceWOVat: z.number(),
  }),

  orderId: z.string().optional(),
  driverNameInOrder: z.string().optional(),
  truckInOrder: z.string().optional(),

  pickedTruckType: z
    .object({
      liftCapacity: z.number(),
      kind: z.string(),
    })
    .optional(),

  pickedPrices: z
    .object({
      price: z.number(),
      vat: z.number(),
      priceWOVat: z.number(),
    })
    .optional(),
})

export class CompareItem {
  constructor(props) {
    compareItemSchema.parse(props)
    Object.assign(this, props)
    this.loaderName = 'cherkizovo_loader'
  }

  exportData() {
    return {
      _id: this._id,
      loaderName: this.loaderName,
      route: this.route,
      truck: this.uploadedTruckNumber,
      driver: this.uploadedDriverName,
      truckType: this.uploadedTruckType,
      price: this.uploadedPrices.price,
      priceWOVat: this.uploadedPrices.priceWOVat,
      isTruckTypeEqual: this.isTruckTypeEqual,
      isTruckEqual: this.isTruckEqual,
      isDriverEqual: this.isDriverEqual,
      isPriceEqual: this.isPriceEqual,
    }
  }
  get isTruckTypeEqual() {
    if (!this.pickedTruckType) return false
    const uploadedTruckType = truckTypeMapper[this.uploadedTruckType]
    return (
      this.pickedTruckType.liftCapacity === uploadedTruckType.liftCapacity &&
      this.pickedTruckType.kind === uploadedTruckType.kind
    )
  }

  get isTruckEqual() {
    const uploadedTruck = CompareItem.prepareRegNum(this.uploadedTruckNumber)
    const truckInOrder = CompareItem.prepareRegNum(this.truckInOrder)
    return uploadedTruck === truckInOrder
  }

  get isDriverEqual() {
    const preparedUploadedDriverName = CompareItem.prepareDriverName(
      this.uploadedDriverName
    )
    const preparedDriverNameInOrder = CompareItem.prepareDriverName(
      this.driverNameInOrder
    )
    return preparedDriverNameInOrder === preparedUploadedDriverName
  }

  get isPriceEqual() {
    return this.uploadedPrices.priceWOVat === this.pickedPrices.priceWOVat
  }

  static createOne(uploadItem, pickedItem) {
    let pickedData = {}
    if (pickedItem)
      pickedData = Object.assign(
        {},
        {
          _id: pickedItem._id,
          orderId: pickedItem.orderId,

          driverNameInOrder: store.getters.driversMap.get(
            pickedItem.confirmedCrew.driver
          )?.fullName,
          pickedTruckType: pickedItem.reqTransport,
          pickedTruckTypeStr:
            pickedItem.reqTransport.liftCapacity +
            `т ${store.getters.truckKindsMap.get(
              pickedItem.reqTransport.kind
            )}`,
          truckInOrder: store.getters.trucksMap.get(
            pickedItem.confirmedCrew.truck
          )?.regNum,
          pickedPrices: {
            price: pickedItem.total.price,
            vat: pickedItem.total.price - pickedItem.total.priceWOVat,
            priceWOVat: pickedItem.total.priceWOVat,
          },
        }
      )
    return new CompareItem({
      isOrderPicked: !!pickedItem,
      route: uploadItem.route,
      clientNum: uploadItem.num,
      uploadedTruckNumber: uploadItem.truck,
      uploadedDriverName: uploadItem.driver,
      uploadedTruckType: uploadItem.truckType,
      uploadedPrices: {
        price: uploadItem.price,
        vat: uploadItem.vat,
        priceWOVat: uploadItem.priceWOVat,
      },
      ...pickedData,
    })
  }

  static createEntities(uploadedOrders, pickedOrders) {
    return uploadedOrders.map((uploadedItem) =>
      CompareItem.createOne(
        uploadedItem,
        pickedOrders.find((order) => order.client.num === uploadedItem.num)
      )
    )
  }

  static prepareDriverName(str) {
    return str
      .split(/[\s,.;]+/)
      .map((word, index) => (index === 0 ? word : word[0]))
      .join('')
      .toLowerCase()
  }

  static prepareRegNum(str) {
    return str.replace(/\s+/g, '').replace(/rus/g, '').toLowerCase()
  }
}

export const usePageData = () => {
  async function pickOrdersByClientNumbers(props) {
    PickOrdersByClientNumbersPropsSchema.parse(props)
    const [orders] = await PaymentInvoiceService.pickOrders(props)
    return orders
  }

  return {
    pickOrdersByClientNumbers,
  }
}
