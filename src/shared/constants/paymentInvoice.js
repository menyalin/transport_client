export const paymentInvoiceStatuses = [
  { text: 'Подготовка', value: 'inProcess' },
  { text: 'Готов к отправке', value: 'prepared' },
  { text: 'Отправлен', value: 'sended' },
  { text: 'Принят', value: 'accepted' },
  { text: 'Оплачен', value: 'paid' },
]

export const PAYMENT_INVOICE_TABLE_HEADERS = [
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
    value: 'date',
    text: 'Дата документа',
    sortable: true,
    default: true,
  },
  {
    value: 'sendDate',
    text: 'Дата отправки',
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
