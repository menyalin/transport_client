import store from '@/store/index.js'

const getOrderNotes = (item) => {
  return {
    'cargoParams.note': item.cargoParams.note || '',
    orderNote: item.note || '',
    pointNotes: item.route
      .map((i) => i.note)
      .filter((i) => !!i)
      .join('; '),
  }
}

const getPriceFields = () => {
  const prices = ['prePrices', 'prices', 'finalPrices']
  const fields = [...store.getters.orderPriceTypes.map((i) => i.value), 'note']
  return prices.reduce(
    (res, current) => [
      ...res,
      ...fields.map((f) => ({
        title: current + '.' + f,
        group: current,
        type: f,
      })),
    ],
    []
  )
}

const getPrices = (item) => {
  const { agreement } = item
  const fields = getPriceFields()
  const res = {}
  let price
  fields.forEach((i) => {
    price = null
    if (i.type !== 'note') {
      price = item[i.group].find((p) => p.type === i.type)
      if (!price) res[i.title] = 0
      else
        res[i.title] = agreement.usePriceWithVAT
          ? price.price
          : price.priceWOVat
    } else
      res[i.title] = item[i.group].find((p) => p.type === 'other')?.note || ''
  })
  return res
}

const _getTruckKind = (req) => {
  if (!req?.kind) return '-'
  return (
    store.getters.truckKindsMap.get(req?.kind) +
    (req?.liftCapacity ? ` ${req.liftCapacity}т` : '')
  )
}

const _getDriverName = (driverId) => {
  if (!driverId || !store.getters.driversMap.has(driverId)) return '-'
  return store.getters.driversMap.get(driverId)?.fullName
}

const _getPoints = ({ route, type }) =>
  route.filter((p) => p.type === type && !p.isReturn)

const _getPartnersName = ({ route, type }) =>
  _getPoints({ route, type })
    .map((p) => store.getters.addressMap.get(p.address)?.partner)
    .map((p) => store.getters.partnersMap.get(p)?.name)
    .join(';')

const _getAddressesName = ({ route, type }) =>
  _getPoints({ route, type })
    .map((p) => store.getters.addressMap.get(p.address).name)
    .join(';')

const _getBasePrice = (prices, agreement) => {
  let res = {
    woVat: 0,
    withVat: 0,
  }
  if (!prices || prices.length === 0) return 0
  const basePrice = prices.find((p) => p.type === 'base')
  if (basePrice) {
    res.woVat = basePrice.priceWOVat || 0
    res.withVat = basePrice.price || 0
  }
  return agreement.usePriceWithVAT ? res.withVat : res.woVat
}
const headers = [
  { val: 'plannedDate', text: 'Дата' },
  { val: 'plannedTime', text: 'Время' },
  { val: 'clientName', text: 'Клиент' },
  { val: null, text: 'Счет' },
  { val: null, text: 'Дата счета' },
  { val: 'regNum', text: 'Номер ТС' },
  { val: 'truckKind', text: 'Тип ТС' },
  { val: 'driverName', text: 'Водитель' },
  { val: null, text: '№ рейса' },
  { val: null, text: '№ аукциона' },
  { val: null, text: '№ заявки' },
  { val: null, text: '№ ТН' },
  { val: 'loadingPartners', text: 'Грузоотправитель' },
  { val: 'loadingAddresses', text: 'Пункты погрузки' },
  { val: 'unloadingPartners', text: 'Грузополучатель' },
  { val: 'unloadingAddresses', text: 'Пункты разгрузки' },
  { val: 'price', text: 'Аукцион' },
  { val: 'loadArrivalDate', text: 'Дата начала погрузки' },
  { val: 'loadArrivalTime', text: 'Время начала погрузки' },
  { val: 'loadDepartureDate', text: 'Дата окончания погрузки' },
  { val: 'loadDepartureTime', text: 'Время окончания погрузки' },
  { val: 'unloadArrivalDate', text: 'Дата начала разгрузки' },
  { val: 'unloadArrivalTime', text: 'Время начала разгрузки' },
  { val: 'unloadDepartureDate', text: 'Дата окончания разгрузки' },
  { val: 'unloadDepartureTime', text: 'Время окончания разгрузки' },
  ...getPriceFields().map((i) => ({ val: i.title, text: i.title })),
  { val: 'cargoParams.note', text: 'Комментарий к грузу' },
  { val: 'orderNote', text: 'Комментарий к рейсу' },
  { val: 'pointNotes', text: 'Комментарии к адресам' },
]

export default ({ items }) => {
  const res = items.slice().map((row) => {
    const loadPoints = _getPoints({ route: row.route, type: 'loading' })
    const unloadPoints = _getPoints({ route: row.route, type: 'unloading' })
    const loadArrivalDate = loadPoints[0].arrivalDate
      ? new Date(loadPoints[0].arrivalDate)
      : null
    const loadDepartureDate = loadPoints[loadPoints.length - 1].departureDate
      ? new Date(loadPoints[loadPoints.length - 1].departureDate)
      : null
    const unloadArrivalDate = unloadPoints[0].arrivalDate
      ? new Date(unloadPoints[0].arrivalDate)
      : null
    const unloadDepartureDate = unloadPoints[unloadPoints.length - 1]
      .departureDate
      ? new Date(unloadPoints[unloadPoints.length - 1].departureDate)
      : null
    return {
      plannedDate: new Date(row.route[0].plannedDate).toLocaleDateString(),
      plannedTime: new Date(row.route[0].plannedDate).toLocaleTimeString(),
      orderType: store.getters.orderAnalyticTypesMap.get(row.analytics.type),
      clientName: store.getters.partnersMap.get(row.client.client)?.name,
      regNum: store.getters.trucksMap.get(row.confirmedCrew.truck)?.regNum,
      truckKind: _getTruckKind(row?.reqTransport),
      driverName: _getDriverName(row.confirmedCrew?.driver),
      loadingPartners: _getPartnersName({
        route: row.route,
        type: 'loading',
      }),
      loadingAddresses: _getAddressesName({
        route: row.route,
        type: 'loading',
      }),
      unloadingPartners: _getPartnersName({
        route: row.route,
        type: 'unloading',
      }),
      unloadingAddresses: _getAddressesName({
        route: row.route,
        type: 'unloading',
      }),

      price: Intl.NumberFormat('ru-RU', {
        style: 'decimal',
        useGrouping: false,
      }).format(_getBasePrice(row.prices, row.agreement)),

      loadArrivalDate: loadArrivalDate
        ? loadArrivalDate.toLocaleDateString()
        : '-',
      loadArrivalTime: loadArrivalDate
        ? loadArrivalDate.toLocaleTimeString()
        : '-',
      loadDepartureDate: loadDepartureDate
        ? loadDepartureDate.toLocaleDateString()
        : '-',
      loadDepartureTime: loadDepartureDate
        ? loadDepartureDate.toLocaleTimeString()
        : '-',
      unloadArrivalDate: unloadArrivalDate
        ? unloadArrivalDate.toLocaleDateString()
        : '-',
      unloadArrivalTime: unloadArrivalDate
        ? unloadArrivalDate.toLocaleTimeString()
        : '-',
      unloadDepartureDate: unloadDepartureDate
        ? unloadDepartureDate.toLocaleDateString()
        : '-',
      unloadDepartureTime: unloadDepartureDate
        ? unloadDepartureDate.toLocaleTimeString()
        : '-',
      ...getPrices(row),
      ...getOrderNotes(row),
    }
  })

  let table = '<table>'
  // table += `<tr>${headers.map((h) => '<td>' + h.text + '</td>').join('')}</tr>`
  res.forEach((item) => {
    table += `<tr>
    ${headers
      .map((h) => (h.val ? '<td>' + item[h.val] + '</td>' : '<td />'))
      .join('')}
      </tr>`
  })
  table += '</table>'
  // type = 'text/plain'
  navigator.clipboard
    .write([
      // eslint-disable-next-line no-undef
      new ClipboardItem({
        'text/html': new Blob([table], { type: 'text/html' }),
      }),
    ])
    .then()
}
