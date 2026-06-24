export const GROUP_BY_ITEMS = [
  { text: 'Клиент', value: 'client', disabled: false, filterName: 'clients' },
  {
    text: 'Соглашение',
    value: 'agreement',
    disabled: false,
    filterName: 'agreements',
  },
  { text: 'ТК', value: 'carrier', disabled: false, filterName: 'carriers' },
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
  { value: '_id', title: '_id', sortable: false },
  { value: 'status', title: 'Статус', sortable: false },
  { value: 'orderDate', title: 'Дата', sortable: true },
  { value: 'client', title: 'Клиент', sortable: false },
  { value: 'agreementName', title: 'Соглашение', sortable: false },
  { value: 'truck', title: 'ТС', sortable: false },
  { value: 'driver', title: 'Водитель', sortable: false },
  { value: 'carrierId', title: 'ТК', sortable: false },
  { value: 'orderType', title: 'Тип рейса', sortable: false },
  { value: 'regionsLoading', title: 'Регионы погрузки', sortable: false },
  { value: 'zonesLoading', title: 'Зоны погрузки', sortable: false },
  { value: 'citiesLoading', title: 'Города погрузки', sortable: false },
  { value: 'addressesLoading', title: 'Адреса погрузки', sortable: false },
  { value: 'regionsUnloading', title: 'Регионы разгрузки', sortable: false },
  { value: 'zonesUnloading', title: 'Зоны разгрузки', sortable: false },
  { value: 'citiesUnloading', title: 'Города разгрузки', sortable: false },
  { value: 'addressesUnloading', title: 'Адреса разгрузки', sortable: false },
  { value: 'capacityType', title: 'Тип ТС', sortable: false },
  { value: 'truckKind', title: 'Вид ТС', sortable: false },

  { value: 'tRegime', title: 'Т-режим', sortable: false },
  {
    value: 'outsourceCostsWithVat',
    title: 'Наемники с НДС',
    sortable: false,
    align: 'right',
  },
  {
    value: 'outsourceCostsWOVat',
    title: 'Наемники без НДС',
    sortable: false,
    align: 'right',
  },
  {
    value: 'basePrePrice',
    title: 'Тариф из ДС',
    align: 'right',
    sortable: false,
  },
  {
    value: 'basePrice',
    title: 'Тариф (аукцион)',
    align: 'right',
    sortable: false,
  },
  {
    value: 'price',
    title: 'Цена',
    align: 'right',
    sortable: true,
  },
  {
    value: 'kPrice',
    title: 'Цена, тыс',
    align: 'right',
    sortable: true,
  },
  { value: 'note', title: 'Примечание', sortable: false },
]

export const DEFAULT_HEADERS = [
  'status',
  'orderDate',
  'client',
  'agreementName',
  'truck',
  'driver',
  'carrierId',
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
  carriers: {
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
  carriers: {
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

const allHeaderValues = ALL_ORDER_TABLE_HEADERS.map((item) => item.value)
DEFAULT_HEADERS.forEach((item) => {
  if (!allHeaderValues.includes(item)) console.error('Bad default header')
})
