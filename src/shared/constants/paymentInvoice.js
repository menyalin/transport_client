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
    width: '100',
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
    width: '170',
    align: 'center',
  },
  {
    value: 'sendDate',
    text: 'Дата отправки',
    sortable: true,
    default: true,
    width: '170',
    align: 'center',
  },
  {
    value: 'plannedPayDate',
    text: 'План. дата оплаты',
    sortable: true,
    default: true,
    width: '170',
    align: 'center',
  },
  {
    value: 'payDate',
    text: 'Дата оплаты',
    sortable: true,
    default: true,
    width: '170',
    align: 'center',
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
    width: '7rem',
  },

  {
    value: 'total.priceWOVat',
    text: 'Сумма без НДС',
    sortable: true,
    default: true,
    align: 'right',
    width: '9rem',
  },
  {
    value: 'vatSum',
    text: 'Сумма НДС',
    sortable: false,
    default: true,
    align: 'right',
    width: '9rem',
  },

  {
    value: 'total.price',
    text: 'Сумма',
    sortable: true,
    default: true,
    align: 'right',
    width: '9rem',
  },
  {
    value: 'createdAt',
    text: 'Дата создания',
    sortable: true,
    default: true,
    width: '11rem',
  },
  {
    value: 'note',
    text: 'Примечание',
    sortable: false,
    default: true,
  },
]
