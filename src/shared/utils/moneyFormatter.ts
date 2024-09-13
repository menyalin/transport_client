export const moneyFormatter = (value, digits = 2) => {
  if (value === 0) return 0
  if (!value || !Number.isFinite(value)) return 'Пусто'

  return new Intl.NumberFormat('ru-RU', {
    maximumFractionDigits: digits,
    minimumFractionDigits: digits,
  }).format(value)
}
