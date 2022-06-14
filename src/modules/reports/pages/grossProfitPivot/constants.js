export const ALL_ORDER_TABLE_HEADERS = [
  { value: '_id', text: '_id', sortable: false },
  { value: 'status', text: 'Статус', sortable: false },
  { value: 'orderDate', text: 'Дата', sortable: false },
  { value: 'client', text: 'Клиент', sortable: false },
  { value: 'truck', text: 'ТС', sortable: false },
  { value: 'driver', text: 'Водитель', sortable: false },
  { value: 'tk', text: 'ТК', sortable: false },
  { value: 'orderType', text: 'Тип рейса', sortable: false },
  { value: 'regionsLoading', text: 'Регионы погрузки', sortable: false },
  { value: 'zonesLoading', text: 'Зоны погрузки', sortable: false },
  { value: 'citiesLoading', text: 'Города погрузки', sortable: false },
  { value: 'addressesLoading', text: 'Адреса погрузки', sortable: false },
  { value: 'regionsUnloading', text: 'Регионы разгрузки', sortable: false },
  { value: 'zonesUnloading', text: 'Зоны разгрузки', sortable: false },
  { value: 'citiesUnloading', text: 'Города разгрузки', sortable: false },
  { value: 'addressesUnloading', text: 'Адреса разгрузки', sortable: false },
  { value: 'capacityType', text: 'Тип ТС', sortable: false },
  { value: 'truckKind', text: 'Вид ТС', sortable: false },
  { value: 'tRegime', text: 'Т-режим', sortable: false },
  {
    value: 'priceWithVat',
    text: 'Цена с НДС',
    align: 'right',
    sortable: false,
  },
  {
    value: 'priceWOVat',
    text: 'Цена без НДС',
    align: 'right',
    sortable: false,
  },
  { value: 'note', text: 'Примечание', sortable: false },
]

export const DEFAULT_HEADERS = [
  'status',
  'orderDate',
  'client',
  'truck',
  'driver',
  'tk',
  'orderType',
  'addressesLoading',
  'addressesUnloading',
  'truckKind',
  'priceWithVat',
]

const allHeaderValues = ALL_ORDER_TABLE_HEADERS.map((item) => item.value)
DEFAULT_HEADERS.forEach((item) => {
  if (!allHeaderValues.includes(item)) console.error('Bad default header')
})
