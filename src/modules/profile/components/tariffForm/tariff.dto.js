export class TariffDTO {
  REQUIRED_FIELDS = [
    'date',
    'loading',
    'unloading',
    'truckKind',
    'liftCapacity',
    'price',
    'group',
    'groupVat',
    'agreementVatRate',
  ]

  constructor(item) {
    this.REQUIRED_FIELDS.forEach((field) => {
      if (item[field] === undefined)
        throw new Error(`Not exist required field: ${field}`)
    })
    const keys = Object.keys(item)
    keys.forEach((key) => {
      this[key] = item[key]
    })
    // this.date = new Date(item.date).toISOString()
    if (item.agreementVatRate !== 0 && item.groupVat) {
      // если цену вносят с НДС
      this.price = item.price
      this.priceWOVat =
        (item.price * 100) / (1 + item.agreementVatRate / 100) / 100
    } else if (item.agreementVatRate !== 0) {
      // если цену вносят без НДС
    } else {
      this.priceWOVat = item.price
      this.sumVat = 0
      this.price = item.price
    }
  }
}

/*

    company: { type: Types.ObjectId, ref: 'Company', required: true },
    date: { type: Date, required: true },
    isActive: { type: Boolean, default: true },
    loading: { type: Types.ObjectId, ref: 'Address', required: true },
    unloading: { type: Types.ObjectId, ref: 'Address', required: true },
    truckKind: { type: String, enum: TRUCK_KINDS_ENUM, required: true },
    liftCapacity: { type: Number, required: true },
    __priceWOVat: { type: Number, required: true },
    __sumVat: { type: Number, required: true },
    price: { type: Number, required: true },
    note: { type: String },
    group: { type: String, required: true },
    groupNote: { type: String },
    groupVat: { type: Boolean, required: true },

*/
