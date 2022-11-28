export const ALL_HEADERS = [
  {
    value: 'orderDate',
    text: 'Дата рейса',
    sortable: false,
    width: '12rem',
    default: true,
    groupable: false,
  },
  {
    value: 'orderTypeStr',
    text: 'Тип рейса',
    sortable: true,
    width: '7rem',
    default: true,
    groupable: true,
  },
  {
    value: 'tkNameStr',
    text: 'TK',
    sortable: false,
    width: '9rem',
    default: true,
    groupable: false,
  },

  {
    value: 'truckNumStr',
    text: 'Грузовик',
    sortable: false,
    align: 'center',
    width: '9rem',
    default: true,
    groupable: false,
  },
  {
    value: 'trailerNumStr',
    text: 'Прицеп',
    sortable: false,
    align: 'center',
    width: '9rem',
    default: false,
    groupable: false,
  },
  {
    value: 'driverFullName',
    text: 'Водитель',
    sortable: true,
    align: 'left',
    default: true,
    groupable: true,
  },
  {
    value: 'clientName',
    text: 'Клиент',
    sortable: true,
    default: true,
    groupable: true,
  },
  {
    value: 'client.num',
    text: '№ Заказа',
    sortable: false,
    default: true,
    groupable: false,
  },
  {
    value: 'client.auctionNum',
    text: '№ Аукциона',
    sortable: false,
    default: true,
    groupable: false,
  },
  {
    value: 'loadingPoints',
    text: 'Погрузка',
    sortable: false,
    default: true,
    groupable: false,
  },
  {
    value: 'unloadingPoints',
    text: 'Разгрузка',
    sortable: false,
    default: true,
    groupable: false,
  },
  {
    value: 'docsState.date',
    text: 'Дата получения',
    sortable: true,
    default: false,
    groupable: false,
    align: 'right',
  },
  {
    value: 'reviewDate',
    text: 'Дата проверки',
    sortable: true,
    default: false,
    groupable: false,
    align: 'right',
  },
  {
    value: 'getDocsDays',
    text: 'Сдача документов, дней',
    sortable: true,
    default: false,
    groupable: false,
    align: 'right',
  },
  {
    value: 'reviewDocsDays',
    text: 'Проверка документов, дней',
    sortable: true,
    default: false,
    groupable: false,
    align: 'right',
  },
  {
    value: '_docsStatusObj.text',
    text: 'Документы',
    sortable: true,
    default: true,
  },
]

/* --------------------------------

  {
    value: 'loadingZones',
    text: 'Зоны погрузки',
    sortable: false,
    default: false,
  },
  
  {
    value: 'agreement.name',
    text: 'Соглашение',
    sortable: false,
    forAccountingMode: true,
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


*/
