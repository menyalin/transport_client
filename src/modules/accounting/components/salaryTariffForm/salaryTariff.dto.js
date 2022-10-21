import dayjs from 'dayjs'

const _REQUIRED_FIELDS = ['date', 'type', 'liftCapacity', 'sum', 'tks']

const TYPES_WITHOUT_PRICE = ['directDistanceZones', 'return']

const _REQUIRED_FIELDS_FOR_POINTS_TYPE = ['loading', 'unloading']
const _REQUIRED_FIELDS_FOR_ZONES_TYPE = ['loadingZone', 'unloadingZone']
const _REQUIRED_FIELDS_FOR_REGIONS_TYPE = ['loadingRegion', 'unloadingRegion']



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

const _REQUIRED_FIELDS_FOR_DIRECT_DISTANCE_ZONES_TYPE = ['loading', 'zones']

const _getRequiredFieldsByType = (type) => {
  let typedFields
  switch (type) {
    case 'points':
      typedFields = _REQUIRED_FIELDS_FOR_POINTS_TYPE
      break
    case 'zones':
      typedFields = _REQUIRED_FIELDS_FOR_ZONES_TYPE
      break
    case 'regions':
      typedFields = _REQUIRED_FIELDS_FOR_REGIONS_TYPE
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
    .filter((i) => (TYPES_WITHOUT_PRICE.includes(type) ? i !== 'price' : true))
}

export class SalaryTariffDTO {
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


    Object.assign(this, {
      date: dayjs(this.date).toISOString(),
    })
  }

  static invalidItem(item) {
    if (!item.type) return true
    if (!Array.isArray(item.tks) || item.tks.length === 0) return true
    if (!Array.isArray(item.liftCapacity) || item.liftCapacity.length === 0)
      return true
    if (item.type === 'directDistanceZones' && !item.zones?.length) return true
    if (
      item.type === 'directDistanceZones' &&
      item.zones.some(
        (i) => !i.distance || i.distance <= 0 || !i.sum || i.sum <= 0
      )
    )
      return true

    return _getRequiredFieldsByType(item.type).some(
      (field) => item[field] === undefined
    )
  }

  static tariffFromDBItem(item) {
    return {
      tmpItem: {
        ...item,
        date: dayjs(item.date).format('YYYY-MM-DD'),
      },
      zones: {
        loadingZone: item.loadingZone,
        unloadingZone: item.unloadingZone,
      },
      regions: {
        loadingRegion: item.loadingRegion,
        unloadingRegion: item.unloadingRegion
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
        zones: item.zones?.map((i) => ({
          ...i,
          price: item.groupVat ? i.price : i.priceWOVat,
        })),
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

  // _getPrices({ price, vatRate, groupVat }) {
  //   const vatKoef = parseFloat(1 + vatRate / 100)
  //   const res = {}
  //   if (vatRate !== 0 && groupVat) {
  //     // если цену вносят с НДС
  //     res.price = price
  //     res.priceWOVat = price / vatKoef
  //     res.sumVat = price - price / vatKoef
  //   } else if (vatRate !== 0) {
  //     // если цену вносят без НДС
  //     res.priceWOVat = price
  //     res.sumVat = price * ((vatKoef * 10 - 10) / 10)
  //     res.price = price + price * ((vatKoef * 10 - 10) / 10)
  //   } else {
  //     res.priceWOVat = price
  //     res.sumVat = 0
  //     res.price = price
  //   }
  //   return res
  // }
}
