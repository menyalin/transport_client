export const moneyFormatter = (value) => {
  if (value === 0) return 0
  if (!value || !Number.isFinite(value)) return 'Пусто'

  return new Intl.NumberFormat('ru-RU', {
    maximumFractionDigits: 2,
    minimumFractionDigits: 2,
  }).format(value)
}
