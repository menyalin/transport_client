export const incomingInvoiceStatuses = [
  { text: 'Подготовка', value: 'preparing' },
  { text: 'К оплате', value: 'toPay' },
  { text: 'Оплачен', value: 'paid' },
]

export const incomingInvoiceStatusMap = incomingInvoiceStatuses.reduce(
  (res, item) => res.set(item.value, item.text),
  new Map()
)
