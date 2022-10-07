export const ALL_ORDER_LIST_HEADERS = [
  {
    value: 'plannedDate',
    text: 'Дата погрузки',
    sortable: false,
    width: '12rem',
  },
  {
    value: 'analytics.type',
    text: 'Тип рейса',
    sortable: false,
    width: '7rem',
  },
  {
    value: 'tk',
    text: 'TK',
    sortable: false,
    width: '9rem',
  },

  {
    value: 'truck',
    text: 'Грузовик',
    sortable: false,
    align: 'center',
    width: '9rem',
  },
  {
    value: 'trailer',
    text: 'Прицеп',
    sortable: false,
    align: 'center',
    width: '9rem',
  },
  {
    value: 'driver',
    text: 'Водитель',
    sortable: false,
    align: 'left',
  },
  {
    value: 'loadingPoints',
    text: 'Погрузка',
    sortable: false,
  },
  { value: 'unloadingPoints', text: 'Разгрузка', sortable: false },
  { value: 'state.status', text: 'Статус', sortable: false },
  { value: 'client.client', text: 'Клиент', sortable: false },
  {
    value: 'client.num',
    text: 'Номер клиента',
    sortable: false,
    forAccountingMode: true,
  },
  {
    value: 'agreement.name',
    text: 'Соглашение',
    sortable: false,
    forAccountingMode: true,
  },
  {
    value: 'docStatus',
    text: 'Документы',
    sortable: false,
    forAccountingMode: true,
  },
  {
    value: 'actions',
    // text: 'Действия',
    sortable: false,
    forAccountingMode: true,
    width: '3rem',
  },
]
