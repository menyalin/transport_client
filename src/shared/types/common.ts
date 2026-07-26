export type Id = string | number

export type DateString = string

export interface SelectOption<T = string> {
  label: string
  value: T
}

export interface PaginatedResponse<T> {
  items: T[]
  total: number
  page?: number
  limit?: number
}
