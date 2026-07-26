export interface LegalEntityType {
  value: string
  title: string
}

export const LEGAL_ENTITY_TYPES: LegalEntityType[] = [
  { value: 'legalEntity', title: 'Юр.лицо' },
  { value: 'soleProprietor', title: 'ИП' },
  { value: 'privatePerson', title: 'Частное лицо' },
]
