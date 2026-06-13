const allHeaders = [
  {
    value: 'client.num',
    title: '№ Заказа',
    sortable: false,
    default: true,
  },
  {
    value: 'plannedDate',
    title: 'Дата погрузки',
    sortable: true,
    width: '12rem',
    default: true,
  },
  {
    value: 'analytics.type',
    title: 'Тип рейса',
    sortable: false,
    width: '7rem',
    default: true,
  },
  {
    value: 'tk',
    title: 'TK',
    sortable: false,
    default: true,
  },

  {
    value: 'truck',
    title: 'Грузовик',
    sortable: true,
    align: 'center',
    width: '9rem',
    default: true,
  },
  {
    value: 'trailer',
    title: 'Прицеп',
    sortable: false,
    align: 'center',
    width: '9rem',
    default: false,
  },
  {
    value: 'driver',
    title: 'Водитель',
    sortable: true,
    align: 'left',
    default: true,
  },
  {
    value: 'loadingZones',
    title: 'Зоны погрузки',
    sortable: false,
    default: false,
  },
  {
    value: 'loadingPoints',
    title: 'Погрузка',
    sortable: false,
    default: true,
  },
  {
    value: 'unloadingPoints',
    title: 'Разгрузка',
    sortable: false,
    default: true,
  },
  { value: 'state.status', title: 'Статус', sortable: false, default: true },
  { value: 'client.client', title: 'Заказчик', sortable: false, default: true },
  {
    value: 'client.auctionNum',
    title: '№ Аукциона',
    sortable: false,
    default: true,
  },

  {
    value: 'agreement.name',
    title: 'Соглашение',
    sortable: false,
    forAccountingMode: true,
    default: true,
  },
  {
    value: 'docNumbers',
    title: 'Номера док-ов',
    sortable: false,
    forAccountingMode: true,
    default: false,
    width: '10rem',
  },
  {
    value: 'docsGetted',
    title: 'Сданы',
    sortable: false,
    forAccountingMode: true,
    default: true,
  },
  {
    value: 'docStatus',
    title: 'Документы',
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
    title: 'Сумма с НДС',
    sortable: false,
    align: 'right',
    default: true,
  },
  {
    value: 'total.priceWOVat',
    title: 'Сумма без НДС',
    sortable: false,
    align: 'right',
    default: false,
  },
  // {
  //   value: 'total.sumVat',
  //   title: 'НДС',
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
