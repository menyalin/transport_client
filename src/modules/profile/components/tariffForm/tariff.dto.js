const _REQUIRED_FIELDS = [
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

export class TariffDTO {
  constructor(item) {
    _REQUIRED_FIELDS.forEach((field) => {
      if (item[field] === undefined)
        throw new Error(`Not exist required field: ${field}`)
    })
    const keys = Object.keys(item)
    keys.forEach((key) => {
      this[key] = item[key]
    })
    const vatKoef = parseFloat(1 + item.agreementVatRate / 100)
    const price = item.price
    // this.date = new Date(item.date).toISOString()
    if (item.agreementVatRate !== 0 && item.groupVat) {
      // если цену вносят с НДС
      this.price = price
      this.priceWOVat = price / vatKoef
      this.sumVat = price - price / vatKoef
    } else if (item.agreementVatRate !== 0) {
      // если цену вносят без НДС
      this.priceWOVat = item.price
      this.sumVat = price * ((vatKoef * 10 - 10) / 10)
      this.price = price + price * ((vatKoef * 10 - 10) / 10)
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
