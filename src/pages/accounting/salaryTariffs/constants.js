export const ALL_LIST_HEADERS = [
  {
    value: '_date',
    text: 'Дата начала действия',
    sortable: false,
    align: 'right',
    default: true,
    width: '10rem',
  },

  { value: '_type', text: 'Тип', sortable: false, default: true },
  { value: '_tks', text: 'ТК', sortable: false, default: true },
  { value: '_result', text: 'Параметры', sortable: false, default: true },
  {
    value: '_consigneeTypes',
    text: 'Типы грузополучателя',
    sortable: false,
    default: true,
  },
  { value: '_clients', text: 'Клиенты', sortable: false, default: true },

  {
    value: '_liftCapacity',
    text: 'Грузоподъемность',
    sortable: false,
    default: true,
  },
  {
    value: '_sum',
    text: 'Тариф',
    sortable: false,
    align: 'right',
    default: true,
  },

  { value: 'note', text: 'Примечание', sortable: false, default: true },
]

export const DEFAULT_HEADERS = ALL_LIST_HEADERS.filter(i => i.default).map(i => i.value)
