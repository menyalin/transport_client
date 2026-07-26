export interface AllowedAgreementHeader {
  title: string
  value: string
  sortable: boolean
  width?: string
}

export const HEADERS: AllowedAgreementHeader[] = [
  {
    title: 'Соглашение',
    value: 'agreementName',
    sortable: false,
    width: '450px',
  },
  {
    title: 'Дата начала',
    value: 'startDateStr',
    sortable: false,
  },
  {
    title: 'Дата окончания',
    value: 'endDateStr',
    sortable: false,
  },
  {
    title: 'Примечание',
    value: 'note',
    sortable: false,
  },
]
