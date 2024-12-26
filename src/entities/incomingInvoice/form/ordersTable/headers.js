export const allHeaders = [
  { value: 'idx', text: '№', sortable: false, default: true },
  { value: 'orderNum', text: 'Номер заявки', sortable: false, default: true },
  { value: 'orderDate', text: 'Дата погрузки', sortable: false, default: true },
  { value: 'driverName', text: 'Водитель', sortable: false, default: true },
  {
    value: 'total.priceWOVat',
    text: 'Тариф без НДС',
    sortable: false,
    default: true,
    align: 'right',
  },
  {
    value: 'total.priceWithVat',
    text: 'Тариф с НДС',
    sortable: false,
    default: true,
    align: 'right',
  },
  { value: 'note', text: 'Примечание', sortable: false, default: true },
]
