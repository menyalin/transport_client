export const GROUP_BY_ITEMS = [
  { text: 'Клиент', value: 'client', disabled: false, filterName: 'clients' },
  {
    text: 'Соглашение',
    value: 'agreement',
    disabled: false,
    filterName: 'agreements',
  },
  { text: 'ТК', value: 'tkName', disabled: false, filterName: 'tkNames' },
  {
    text: 'Регион',
    value: 'orderType',
    disabled: false,
    filterName: 'orderTypes',
  },
  { text: 'ТС', value: 'truck', disabled: false, filterName: 'trucks' },
  { text: 'Водитель', value: 'driver', disabled: false, filterName: 'drivers' },
  {
    text: 'Регион погрузки',
    value: 'loadingRegion',
    disabled: false,
    filterName: 'loadingRegions',
  },
]

export const ALL_ORDER_TABLE_HEADERS = [
  { value: '_id', text: '_id', sortable: false },
  { value: 'status', text: 'Статус', sortable: false },
  { value: 'orderDate', text: 'Дата', sortable: true },
  { value: 'client', text: 'Клиент', sortable: false },
  { value: 'agreementName', text: 'Соглашение', sortable: false },
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
    value: 'outsourceCostsWithVat',
    text: 'Наемники с НДС',
    sortable: false,
    align: 'right',
  },
  {
    value: 'outsourceCostsWOVat',
    text: 'Наемники без НДС',
    sortable: false,
    align: 'right',
  },
  {
    value: 'basePrePrice',
    text: 'Тариф из ДС',
    align: 'right',
    sortable: false,
  },
  {
    value: 'basePrice',
    text: 'Тариф (аукцион)',
    align: 'right',
    sortable: false,
  },
  {
    value: 'price',
    text: 'Цена',
    align: 'right',
    sortable: true,
  },
  {
    value: 'kPrice',
    text: 'Цена, тыс',
    align: 'right',
    sortable: true,
  },
  { value: 'note', text: 'Примечание', sortable: false },
]

export const DEFAULT_HEADERS = [
  'status',
  'orderDate',
  'client',
  'agreementName',
  'truck',
  'driver',
  'tk',
  'orderType',
  'addressesLoading',
  'addressesUnloading',
  'truckKind',
  'price',
]

export const MAIN_FILTER_LIST = {
  clients: {
    values: [],
    cond: 'in',
  },
  agreements: {
    values: [],
    cond: 'in',
  },
  tkNames: {
    values: [],
    cond: 'in',
  },
  trucks: {
    values: [],
    cond: 'in',
  },
  drivers: {
    values: [],
    cond: 'in',
  },
  orderTypes: {
    values: [],
    cond: 'in',
  },
  loadingRegions: {
    values: [],
    cond: 'in',
  },
  unloadingRegions: {
    values: [],
    cond: 'in',
  },
  loadingZones: {
    values: [],
    cond: 'in',
  },
  unloadingZones: {
    values: [],
    cond: 'in',
  },
}

export const ADDITIONAL_FILTER_LIST = {
  clients: {
    values: [],
    cond: 'in',
  },
  agreements: {
    values: [],
    cond: 'in',
  },
  tkNames: {
    values: [],
    cond: 'in',
  },
  trucks: {
    values: [],
    cond: 'in',
  },
  drivers: {
    values: [],
    cond: 'in',
  },
  orderTypes: {
    values: [],
    cond: 'in',
  },
  loadingRegions: {
    values: [],
    cond: 'in',
  },
  unloadingRegions: {
    values: [],
    cond: 'in',
  },
  loadingZones: {
    values: [],
    cond: 'in',
  },
  unloadingZones: {
    values: [],
    cond: 'in',
  },
}

const allHeaderValues = ALL_ORDER_TABLE_HEADERS.map(item => item.value)
DEFAULT_HEADERS.forEach(item => {
  if (!allHeaderValues.includes(item)) console.error('Bad default header')
})
