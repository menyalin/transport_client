import moment from 'moment'

const _REQUIRED_FIELDS_FOR_POINTS_TYPE = ['loading', 'unloading']

const _REQUIRED_FIELDS_FOR_ADDIONAL_POINTS_TYPE = [
  'orderType',
  'includedPoints',
]

const _REQUIRED_FIELDS_FOR_RETURN_TYPE = ['percentOfTariff']

const _REQUIRED_FIELDS_FOR_WAITING_TYPE = [
  'orderType',
  'includeHours',
  'roundByHours',
  'tariffBy',
]

const _REQUIRED_FIELDS_FOR_DIRECT_DISTANCE_ZONES_TYPE = [
  'loading',
  'maxDistance',
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
    case 'directDistanceZones':
      typedFields = _REQUIRED_FIELDS_FOR_DIRECT_DISTANCE_ZONES_TYPE
      break
    case 'waiting':
      typedFields = _REQUIRED_FIELDS_FOR_WAITING_TYPE
      break
    case 'return':
      typedFields = _REQUIRED_FIELDS_FOR_RETURN_TYPE
      break
    default:
      throw new Error(`"${type}" - incorrect tariff type`)
  }
  return _REQUIRED_FIELDS
    .concat(typedFields)
    .filter((i) => (type !== 'return' ? true : i !== 'price')) // Для возврата Price  не нужен
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
    if (item.type === 'return') {
      // для "Возврата" цена не имеет смысла
      this.price = 0
      this.priceWOVat = 0
      this.sumVat = 0
      return null
    }
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
      directDistanceZones: {
        loading: item.loading,
        maxDistance: item.maxDistance,
      },
      waiting: {
        includeHours: item.includeHours,
        roundByHours: item.roundByHours,
        orderType: item.orderType,
        tariffBy: item.tariffBy,
      },
      return: {
        percentOfTariff: item.percentOfTariff,
      },
    }
  }
}
