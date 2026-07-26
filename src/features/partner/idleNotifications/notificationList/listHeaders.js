export const headers = [
  {
    title: 'Название',
    key: 'title',
  },
  {
    title: 'Соглашение',
    key: 'agreement',
    width: '200px',
  },
  { title: 'Адреса', key: 'addresses' },
  { title: 'Основные получатели', key: 'emails' },
  { title: 'Копия', key: 'ccEmails' },
  { title: 'Скрытая копия', key: 'bccEmails' },
  {
    title: 'Часов',
    key: 'idleHoursBeforeNotify',
    align: 'center',
  },
  {
    title: 'Плановая дата',
    key: 'usePlannedDate',
    align: 'center',
    sortable: false,
  },
  { title: 'Включено', key: 'isActive', align: 'center', sortable: false },
  { title: 'Примечание', key: 'note', sortable: false },
  { key: 'active', sortable: false, align: 'center' },
]
