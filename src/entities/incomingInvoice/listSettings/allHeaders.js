export default [
  {
    value: 'number',
    text: 'Номер',
    sortable: true,
    default: true,
  },
  {
    value: 'date',
    text: 'Дата',
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
    value: 'total.priceWOVat',
    text: 'Сумма без НДС',
    sortable: true,
    default: true,
    align: 'right',
    width: '10rem',
  },

  {
    value: 'total.price',
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
