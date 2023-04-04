export default [
  {
    text: '№',
    value: 'idx',
    align: 'right',
    width: '2rem',
    sortable: false,
  },
  {
    text: '№ Рейса',
    value: 'client.num',
    sortable: false,
    align: 'center',
    default: true,
    width: '5rem',
  },
  {
    value: 'plannedDate',
    text: 'Дата',
    sortable: false,
    align: 'center',
    width: '10rem',
    default: true,
  },
  {
    value: 'driverName',
    text: 'Водитель',
    sortable: false,
    align: 'left',
    default: true,
    width: '20rem',
  },
  {
    value: 'savedTotal.priceWOVat',
    text: 'Сумма без НДС',
    sortable: false,
    align: 'right',
    default: true,
    width: '7rem',
  },
  {
    value: 'vatSum',
    text: 'Сумма НДС',
    sortable: false,
    align: 'right',
    default: true,
    width: '7rem',
  },
  {
    value: 'savedTotal.price',
    text: 'Сумма',
    sortable: false,
    align: 'right',
    default: true,
    width: '7rem',
  },
  {
    value: 'needUpdate',
    sortable: false,
    align: 'center',
    default: true,
    width: '2rem',
  },

  {
    text: 'Примечание',
    value: 'note',
    sortable: false,
    align: 'left',
    width: '14rem',
    default: true,
  },
]
