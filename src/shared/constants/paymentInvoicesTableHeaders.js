export default [
  {
    value: 'number',
    text: 'Номер',
    sortable: true,
    default: true,
  },
  {
    value: 'numberByClient',
    text: '№ реестра клиента',
    sortable: false,
    default: true,
    width: '120',
  },
  {
    value: 'sendDate',
    text: 'Дата выставления',
    sortable: true,
    default: true,
  },

  {
    value: 'statusStr',
    text: 'Статус',
    sortable: false,
    default: true,
  },

  {
    value: 'clientName',
    text: 'Клиент',
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
    value: 'count',
    text: 'Рейсы',
    sortable: false,
    default: true,
    align: 'right',
    width: '10rem',
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
    value: 'vatSum',
    text: 'Сумма НДС',
    sortable: false,
    default: true,
    align: 'right',
    width: '10rem',
  },

  {
    value: 'total.price',
    text: 'Сумма',
    sortable: true,
    default: true,
    align: 'right',
    width: '10rem',
  },
  {
    value: 'createdAt',
    text: 'Дата создания',
    sortable: true,
    default: true,
  },
  {
    value: 'note',
    text: 'Примечание',
    sortable: false,
    default: true,
  },
]
