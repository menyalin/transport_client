import dayjs from 'dayjs'
import { Price } from './index'

const TYPES_WITHOUT_PRICE = ['directDistanceZones', 'return']

const _REQUIRED_FIELDS_FOR_POINTS_TYPE = ['loading', 'unloading']
const _REQUIRED_FIELDS_FOR_ZONES_TYPE = ['loadingZone', 'unloadingZone']

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

const _REQUIRED_FIELDS = [
  'date',
  'type',
  'agreement',
  'truckKind',
  'liftCapacity',
]

const _getRequiredFieldsByType = (type) => {
  let typedFields
  switch (type) {
    case 'points':
      typedFields = _REQUIRED_FIELDS_FOR_POINTS_TYPE
      break
    case 'zones':
      typedFields = _REQUIRED_FIELDS_FOR_ZONES_TYPE
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

export class Tariff {
  constructor(item) {
    if (!item.type) throw new Error('Tariff type is undefinded')

    const requiredField = _getRequiredFieldsByType(item.type)
    requiredField.forEach((field) => {
      if (item[field] === undefined)
        throw new Error(`Not exist required field: ${field}`)
    })
    const keys = Object.keys(item)

    keys.forEach((key) => {
      if (key === 'price') this.price = new Price(item.price, item.withVat)
      else this[key] = item[key]
    })

    if (item.type === 'directDistanceZones') {
      this.zones = item.zones.sort((a, b) => a.distance - b.distance)
    }

    this.price = new Price(item.price || 0, item.withVat)
    this.date = dayjs(this.date).startOf('day').toISOString()
  }

  static invalidItem(item) {
    if (!item.type) return true
    if (item.type === 'directDistanceZones' && !item.zones?.length) return true
    if (
      item.type === 'directDistanceZones' &&
      item.zones.some(
        (i) => !i.distance || i.distance <= 0 || !i.price || i.price <= 0
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
        price: item.price?.price,
        withVat: item.price?.withVat,
      },
      zones: {
        loadingZone: item.loadingZone,
        unloadingZone: item.unloadingZone,
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
        zones: item.zones,
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
