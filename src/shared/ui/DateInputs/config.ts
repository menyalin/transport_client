export interface PeriodItem {
  value: string
  label: string
}

export const periodItems: PeriodItem[] = [
  { value: 'today', label: 'Сегодня' },
  { value: 'yesterday', label: 'Вчера' },
  { value: 'dayBeforeYesterday', label: 'Позавчера' },
  { value: 'this-week', label: 'Эта неделя' },
  { value: 'last-week', label: 'Прошлая неделя' },
  { value: 'this-month', label: 'Этот месяц' },
  { value: 'last-month', label: 'Прошлый месяц' },
  { value: 'this-year', label: 'Этот год' },
  { value: 'last-year', label: 'Прошлый год' },
  { value: 'last-7-days', label: 'Последние 7 дней' },
  { value: 'last-30-days', label: 'Последние 30 дней' },
]
