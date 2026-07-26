export interface IncomingInvoiceStatus {
  text: string
  value: string
}

export const incomingInvoiceStatuses: IncomingInvoiceStatus[] = [
  { text: 'Подготовка', value: 'preparing' },
  { text: 'К оплате', value: 'toPay' },
  { text: 'Оплачен', value: 'paid' },
]

export const incomingInvoiceStatusMap: Map<string, string> = incomingInvoiceStatuses.reduce(
  (res, item) => res.set(item.value, item.text),
  new Map<string, string>()
)
