export function sortingAdapterForOldApi(sortBy) {
  return {
    sortBy: sortBy?.map((i) => i.key) || [],
    sortDesc: sortBy?.map((i) => Boolean(i.order === 'desc')) || [],
  }
}
