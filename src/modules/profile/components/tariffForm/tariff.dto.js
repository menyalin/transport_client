import moment from 'moment'

const _REQUIRED_FIELDS_FOR_POINTS_TYPE = ['loading', 'unloading']

const _REQUIRED_FIELDS_FOR_ADDIONAL_POINTS_TYPE = [
  'orderType',
  'includedPoints',
]

const _REQUIRED_FIELDS = [
  'date',
  'type',
  'agreement',
  'agreementVatRate',
  'truckKind',
  'liftCapacity',
  'price',
  'group',
  'groupVat',
]

const _getRequiredFieldsByType = (type) => {
  let typedFields
  switch (type) {
    case 'points':
      typedFields = _REQUIRED_FIELDS_FOR_POINTS_TYPE
      break
    case 'additionalPoints':
      typedFields = _REQUIRED_FIELDS_FOR_ADDIONAL_POINTS_TYPE
      break
    default:
      throw new Error('incorrect tariff type')
  }
  return _REQUIRED_FIELDS.concat(typedFields)
}

export class TariffDTO {
  constructor(item) {
    if (!item.type) throw new Error('Tariff type is undefinded')
    const requiredField = _getRequiredFieldsByType(item.type)
    requiredField.forEach((field) => {
      if (item[field] === undefined)
        throw new Error(`Not exist required field: ${field}`)
    })
    const keys = Object.keys(item)
    keys.forEach((key) => {
      this[key] = item[key]
    })
    const vatKoef = parseFloat(1 + item.agreementVatRate / 100)
    const price = item.price
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
  static invalidItem(item) {
    
    if (!item.type) return true
    return _getRequiredFieldsByType(item.type).some(
      (field) => item[field] === undefined
    )
  }

  static tariffFromDBItem(item) {
    return {
      tmpItem: {
        ...item,
        date: moment(item.date).format('YYYY-MM-DD'),
        price: item.groupVat ? item.price : item.priceWOVat,
        agreement: item.agreement?._id || item.agreement,
      },
      points: {
        loading: item.loading,
        unloading: item.unloading,
      },
      additionalPoints: {
        includedPoints: item.includedPoints,
        orderType: item.orderType,
      },
    }
  }
}

/* 
    company: { type: Types.ObjectId, ref: 'Company', required: true },
    date: { type: Date, required: true },
    type: { type: String, enum: TARIFF_TYPES_ENUM },
    isActive: { type: Boolean, default: true },
    truckKind: { type: String, enum: TRUCK_KINDS_ENUM, required: true },
    liftCapacity: { type: Number, required: true },
    priceWOVat: { type: Number, required: true },
    sumVat: { type: Number, required: true },
    price: { type: Number, required: true },
    note: { type: String },
    group: { type: String, required: true },
    groupNote: { type: String },
    groupVat: { type: Boolean, required: true },
    agreement: { type: Types.ObjectId, ref: 'Agreement', required: true },
    agreementVatRate: { type: Number, required: true },

    // for 'points' type
    loading: { type: Types.ObjectId, ref: 'Address', required: true },
    unloading: { type: Types.ObjectId, ref: 'Address', required: true },
    
    // for 'additionalPoints' type
    routeType: { type: String, enum: ORDER_ANALYTIC_TYPES_ENUM },
    includedPoints: { type: Number },
*/
