import dayjs from 'dayjs'

const _REQUIRED_FIELDS = ['date', 'type', 'liftCapacity', 'sum', 'tks', 'consigneeTypes']

const _REQUIRED_FIELDS_FOR_POINTS_TYPE = ['loading', 'unloading']
const _REQUIRED_FIELDS_FOR_ZONES_TYPE = ['loadingZone', 'unloadingZone']
const _REQUIRED_FIELDS_FOR_REGIONS_TYPE = ['loadingRegion', 'unloadingRegion']

const _REQUIRED_FIELDS_FOR_ADDIONAL_POINTS_TYPE = ['orderType', 'includedPoints', 'clients']

const _REQUIRED_FIELDS_FOR_RETURN_TYPE = ['clients', 'orderType']

const _REQUIRED_FIELDS_FOR_WAITING_TYPE = ['orderType', 'includeHours', 'roundByHours', 'tariffBy', 'clients']

const _getRequiredFieldsByType = type => {
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
    case 'waiting':
      typedFields = _REQUIRED_FIELDS_FOR_WAITING_TYPE
      break
    case 'return':
      typedFields = _REQUIRED_FIELDS_FOR_RETURN_TYPE
      break
    default:
      throw new Error(`"${type}" - incorrect tariff type`)
  }
  return _REQUIRED_FIELDS.concat(typedFields)
}

export class SalaryTariffDTO {
  constructor(item) {
    if (!item.type) throw new Error('Tariff type is undefinded')
    const requiredField = _getRequiredFieldsByType(item.type)
    requiredField.forEach(field => {
      if (item[field] === undefined) throw new Error(`Not exist required field: ${field}`)
    })
    const keys = Object.keys(item)
    keys.forEach(key => {
      this[key] = item[key]
    })

    Object.assign(this, {
      date: dayjs(this.date).toISOString(),
    })
  }

  static invalidItem(item) {
    if (!item.type) return true
    if (!Array.isArray(item.consigneeTypes) || item.consigneeTypes.length === 0) return true
    if (!Array.isArray(item.tks) || item.tks.length === 0) return true
    if (!Array.isArray(item.liftCapacity) || item.liftCapacity.length === 0) return true

    if (item.type === 'waiting' && (!Array.isArray(item.clients) || item.clients.length === 0)) return true

    if (
      ['return', 'additionalPoints'].includes(item.type) &&
      (!Array.isArray(item.clients) || item.clients.length === 0)
    )
      return true

    return _getRequiredFieldsByType(item.type).some(field => item[field] === undefined)
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
        unloadingRegion: item.unloadingRegion,
      },

      points: {
        loading: item.loading,
        unloading: item.unloading,
      },

      additionalPoints: {
        includedPoints: item.includedPoints,
        orderType: item.orderType,
        clients: item.clients,
      },

      waiting: {
        includeHours: item.includeHours,
        roundByHours: item.roundByHours,
        orderType: item.orderType,
        tariffBy: item.tariffBy,
        clients: item.clients,
      },

      return: {
        clients: item.clients,
        isPltReturn: item.isPltReturn,
        orderType: item.orderType,
      },
    }
  }
}
