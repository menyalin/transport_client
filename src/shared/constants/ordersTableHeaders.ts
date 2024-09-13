const allHeaders = [
  {
    value: 'client.num',
    text: '№ Заказа',
    sortable: false,
    default: true,
  },
  {
    value: 'plannedDate',
    text: 'Дата погрузки',
    sortable: true,
    width: '12rem',
    default: true,
  },
  {
    value: 'analytics.type',
    text: 'Тип рейса',
    sortable: false,
    width: '7rem',
    default: true,
  },
  {
    value: 'tk',
    text: 'TK',
    sortable: false,
    width: '9rem',
    default: true,
  },

  {
    value: 'truck',
    text: 'Грузовик',
    sortable: true,
    align: 'center',
    width: '9rem',
    default: true,
  },
  {
    value: 'trailer',
    text: 'Прицеп',
    sortable: false,
    align: 'center',
    width: '9rem',
    default: false,
  },
  {
    value: 'driver',
    text: 'Водитель',
    sortable: true,
    align: 'left',
    default: true,
  },
  {
    value: 'loadingZones',
    text: 'Зоны погрузки',
    sortable: false,
    default: false,
  },
  {
    value: 'loadingPoints',
    text: 'Погрузка',
    sortable: false,
    default: true,
  },
  {
    value: 'unloadingPoints',
    text: 'Разгрузка',
    sortable: false,
    default: true,
  },
  { value: 'state.status', text: 'Статус', sortable: false, default: true },
  { value: 'client.client', text: 'Заказчик', sortable: false, default: true },
  {
    value: 'client.auctionNum',
    text: '№ Аукциона',
    sortable: false,
    default: true,
  },

  {
    value: 'agreement.name',
    text: 'Соглашение',
    sortable: false,
    forAccountingMode: true,
    default: true,
  },
  {
    value: 'docNumbers',
    text: 'Номера док-ов',
    sortable: false,
    forAccountingMode: true,
    default: false,
    width: '10rem',
  },
  {
    value: 'docsGetted',
    text: 'Сданы',
    sortable: false,
    forAccountingMode: true,
    default: true,
  },
  {
    value: 'docStatus',
    text: 'Документы',
    sortable: false,
    default: true,
  },
  {
    value: 'actions',
    hiddenTitle: 'Доп.действия',
    sortable: false,
    forAccountingMode: true,
    width: '3rem',
    default: true,
  },
]

const totalPriceHeaders = [
  {
    value: 'total.price',
    text: 'Сумма с НДС',
    sortable: false,
    align: 'right',
    default: true,
  },
  {
    value: 'total.priceWOVat',
    text: 'Сумма без НДС',
    sortable: false,
    align: 'right',
    default: false,
  },
  // {
  //   value: 'total.sumVat',
  //   text: 'НДС',
  //   sortable: false,
  //   align: 'right',
  //   default: false,
  // },
]

export default allHeaders

const addItemColumn = {
  value: 'addItemColumn',
  hiddenTitle: 'Кнопка быстрого добавления',
  sortable: false,
  align: 'center',
  width: '2rem',
  default: true,
}

export function PickOrdersForPaymentInvoiceHeaders() {
  return [addItemColumn, ...allHeaders, ...totalPriceHeaders]
}

export function PickOrdersForDocsRegistryHeaders() {
  return [addItemColumn, ...allHeaders]
}
