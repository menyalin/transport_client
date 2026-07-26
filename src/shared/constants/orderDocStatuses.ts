export interface OrderDocStatus {
  value: string
  title: string
}

export const ORDER_DOC_STATUSES: OrderDocStatus[] = [
  { value: 'accepted', title: 'Приняты' },
  { value: 'needFix', title: 'На исправлении' },
  { value: 'onCheck', title: 'На проверке' },
  { value: 'missing', title: 'Не получены' },
]
