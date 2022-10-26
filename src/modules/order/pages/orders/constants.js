export const ALL_ORDER_LIST_HEADERS = [
  {
    value: 'plannedDate',
    text: 'Дата погрузки',
    sortable: false,
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
    sortable: false,
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
    sortable: false,
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
  { value: 'client.client', text: 'Клиент', sortable: false, default: true },
  {
    value: 'client.num',
    text: '№ Заказа',
    sortable: false,
    default: true,
  },
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
    // text: 'Действия',
    sortable: false,
    forAccountingMode: true,
    width: '3rem',
    default: true,
  },
]

export const DEFAULT_HEADERS = ALL_ORDER_LIST_HEADERS.filter(
  (i) => i.default
).map((i) => i.value)
