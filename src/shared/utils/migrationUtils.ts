export interface SortByItem {
  key: string
  order: 'asc' | 'desc'
}

export interface OldApiSorting {
  sortBy: string[]
  sortDesc: boolean[]
}

export function sortingAdapterForOldApi(sortBy: SortByItem[] | null | undefined): OldApiSorting {
  return {
    sortBy: sortBy?.map((i) => i.key) || [],
    sortDesc: sortBy?.map((i) => Boolean(i.order === 'desc')) || [],
  }
}
