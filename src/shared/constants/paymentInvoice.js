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
    title: 'Номер',
    sortable: true,
    default: true,
    width: '100',
  },
  {
    value: 'numberByClient',
    title: '№ реестра клиента',
    sortable: false,
    default: true,
    width: '120',
  },
  {
    value: 'date',
    title: 'Дата документа',
    sortable: true,
    default: true,
    width: '170',
    align: 'center',
  },
  {
    value: 'sendDate',
    title: 'Дата отправки',
    sortable: true,
    default: true,
    width: '170',
    align: 'center',
  },
  {
    value: 'plannedPayDate',
    title: 'План. дата оплаты',
    sortable: true,
    default: true,
    width: '170',
    align: 'center',
  },
  {
    value: 'payDate',
    title: 'Дата оплаты',
    sortable: true,
    default: true,
    width: '170',
    align: 'center',
  },

  {
    value: 'statusStr',
    title: 'Статус',
    sortable: false,
    default: true,
  },

  {
    value: 'clientName',
    title: 'Клиент',
    sortable: false,
    default: true,
  },
  {
    value: 'agreementName',
    title: 'Соглашение',
    sortable: false,
    default: true,
  },
  {
    value: 'ordersCount',
    title: 'Рейсы',
    sortable: false,
    default: true,
    align: 'right',
    width: '7rem',
  },

  {
    value: 'priceWOVat',
    title: 'Сумма без НДС',
    sortable: true,
    default: true,
    align: 'right',
    width: '9rem',
  },
  {
    value: 'vatSum',
    title: 'Сумма НДС',
    sortable: false,
    default: true,
    align: 'right',
    width: '9rem',
  },

  {
    value: 'priceWithVat',
    title: 'Сумма',
    sortable: true,
    default: true,
    align: 'right',
    width: '9rem',
  },
  {
    value: 'createdAt',
    title: 'Дата создания',
    sortable: true,
    default: true,
    width: '11rem',
  },
  {
    value: 'note',
    title: 'Примечание',
    sortable: false,
    default: true,
  },
]
