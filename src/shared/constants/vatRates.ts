export interface VatRateItem {
  title: string
  value: number
}

export const VAT_RATE_ITEMS: VatRateItem[] = [
  { title: 'Без НДС', value: 0 },
  { title: '5%', value: 5 },
  { title: '8%', value: 8 },
  { title: '20%', value: 20 },
  { title: '22%', value: 22 },
]
