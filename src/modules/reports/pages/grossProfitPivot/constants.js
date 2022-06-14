export const ALL_ORDER_TABLE_HEADERS = [
  { value: '_id', text: '_id' },
  { value: 'status', text: 'Статус' },
  { value: 'orderDate', text: 'Дата' },
  { value: 'client', text: 'Клиент' },
  { value: 'truck', text: 'ТС' },
  { value: 'driver', text: 'Водитель' },
  { value: 'tk', text: 'ТК' },
  { value: 'orderType', text: 'Тип рейса' },
  { value: 'regionsLoading', text: 'Регионы погрузки' },
  { value: 'zonesLoading', text: 'Зоны погрузки' },
  { value: 'citiesLoading', text: 'Города погрузки' },
  { value: 'addressesLoading', text: 'Адреса погрузки' },
  { value: 'regionsUnloading', text: 'Регионы разгрузки' },
  { value: 'zonesUnloading', text: 'Зоны разгрузки' },
  { value: 'citiesUnloading', text: 'Города разгрузки' },
  { value: 'addressesUnloading', text: 'Адреса разгрузки' },
  { value: 'capacityType', text: 'Тип ТС' },
  { value: 'truckKind', text: 'Вид ТС' },
  { value: 'tRegime', text: 'Т-режим' },
  { value: 'priceWithVat', text: 'Цена с НДС', align: 'right' },
  { value: 'priceWOVat', text: 'Цена без НДС', align: 'right' },
  { value: 'note', text: 'Примечание' },
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
