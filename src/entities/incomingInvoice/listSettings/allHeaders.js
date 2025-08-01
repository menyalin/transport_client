export default [
  {
    value: 'number',
    text: 'Номер',
    sortable: true,
    default: true,
  },
  {
    value: 'date',
    text: 'Дата документа',
    sortable: true,
    default: true,
    align: 'center',
  },
  {
    value: 'receiptDate',
    text: 'Дата получения',
    sortable: true,
    default: true,
    align: 'center',
  },
  {
    value: 'plannedPayDate',
    text: 'Плановая дата оплаты',
    sortable: true,
    default: true,
    align: 'center',
  },
  {
    value: 'payDate',
    text: 'Дата оплаты',
    sortable: true,
    default: true,
    align: 'center',
  },
  {
    value: 'status',
    text: 'Статус',
    sortable: false,
    default: true,
  },
  {
    value: 'agreementName',
    text: 'Соглашение',
    sortable: false,
    default: true,
  },
  {
    value: 'carrierName',
    text: 'Перевозчик',
    sortable: false,
    default: true,
  },
  {
    value: 'ordersCount',
    text: 'Кол-во рейсов',
    sortable: true,
    default: false,
    align: 'right',
    width: '10rem',
  },
  {
    value: 'priceWOVat',
    text: 'Сумма без НДС',
    sortable: true,
    default: true,
    align: 'right',
    width: '10rem',
  },

  {
    value: 'priceWithVat',
    text: 'Сумма',
    sortable: true,
    default: false,
    align: 'right',
    width: '10rem',
  },
  {
    value: 'note',
    text: 'Примечание',
    sortable: false,
    default: true,
  },
]
