export const headers = [
  {
    text: 'Название',
    value: 'title',
  },
  {
    text: 'Соглашение',
    value: 'agreement',
    width: '200px',
  },
  { text: 'Адреса', value: 'addresses' },
  { text: 'Основные получатели', value: 'emails' },
  { text: 'Копия', value: 'ccEmails' },
  { text: 'Скрытая копия', value: 'bccEmails' },
  {
    text: 'Часов',
    value: 'idleHoursBeforeNotify',
    align: 'center',
  },
  {
    text: 'Плановая дата',
    value: 'usePlannedDate',
    align: 'center',
    sortable: false,
  },
  { text: 'Включено', value: 'isActive', align: 'center', sortable: false },
  { text: 'Примечание', value: 'note', sortable: false },
  { value: 'active', sortable: false, align: 'center' },
]
