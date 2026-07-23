export const allHeaders = [
  { value: 'idx', title: '№', sortable: false, default: true },
  { value: 'orderNum', title: 'Номер заявки', sortable: false, default: true },
  { value: 'orderDate', title: 'Дата погрузки', sortable: false, default: true },
  { value: 'driverName', title: 'Водитель', sortable: false, default: true },
  {
    value: 'total.priceWOVat',
    title: 'Тариф без НДС',
    sortable: false,
    default: true,
    align: 'right',
  },
  {
    value: 'total.priceWithVat',
    title: 'Тариф с НДС',
    sortable: false,
    default: true,
    align: 'right',
  },
  { value: 'note', title: 'Примечание', sortable: false, default: true },
]
