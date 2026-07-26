export const moneyFormatter = (value: number | null | undefined, digits = 2): string | number => {
  if (value === 0) return 0
  if (!value || !Number.isFinite(value)) return 'Пусто'

  return new Intl.NumberFormat('ru-RU', {
    maximumFractionDigits: digits,
    minimumFractionDigits: digits,
  }).format(value)
}
