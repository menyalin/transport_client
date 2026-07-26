export interface VatRatesHeader {
  title: string
  value: string
  sortable: boolean
}

export const HEADERS: VatRatesHeader[] = [
  {
    title: 'Ставка НДС',
    value: 'vatRateDisplay',
    sortable: false,
  },
  {
    title: 'Период',
    value: 'periodDisplay',
    sortable: false,
  },
  {
    title: 'Примечание',
    value: 'noteDisplay',
    sortable: false,
  },
]
