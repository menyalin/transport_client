export const ALL_LIST_HEADERS = [
  {
    value: '_date',
    title: 'Дата начала действия',
    sortable: false,
    align: 'right',
    default: true,
    width: '10rem',
  },

  { value: '_type', title: 'Тип', sortable: false, default: true },
  { value: '_tks', title: 'ТК', sortable: false, default: true },
  { value: '_result', title: 'Параметры', sortable: false, default: true },
  {
    value: '_consigneeTypes',
    title: 'Типы грузополучателя',
    sortable: false,
    default: true,
  },
  { value: '_clients', title: 'Клиенты', sortable: false, default: true },

  {
    value: '_liftCapacity',
    title: 'Грузоподъемность',
    sortable: false,
    default: true,
  },
  {
    value: '_sum',
    title: 'Тариф',
    sortable: false,
    align: 'right',
    default: true,
  },

  { value: 'note', title: 'Примечание', sortable: false, default: true },
]

export const DEFAULT_HEADERS = ALL_LIST_HEADERS.filter((i) => i.default).map((i) => i.value)
