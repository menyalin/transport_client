import getDaysFromPeriod from '@/modules/common/helpers/getDaysFromPeriod'
import dayjs from 'dayjs'

export const diffSets = (a: Set<string>, b: Set<string>): Set<string> => {
  const _diffSet = new Set(a)
  b.forEach((i) => _diffSet.delete(i))
  return _diffSet
}

export const getPeriodFromDatesSet = (set: Set<string> | null | undefined): string[] => {
  if (!set || !set?.size) return []
  const res: string[] = []
  set.forEach((i) => !isNaN(Date.parse(i)) && res.push(dayjs(i).format('YYYY-MM-DD')))
  res.sort((a, b) => new Date(a).getTime() - new Date(b).getTime())
  return [res[0], res[res.length - 1]]
}

const periodDifference = (
  newPeriod: string[],
  oldPeriod: string[] = []
): {
  added: string[]
  deleted: string[]
} => {
  if (oldPeriod.length === 0) return { added: newPeriod, deleted: [] }
  const newDaysSet = new Set(getDaysFromPeriod(newPeriod).map((i: any) => i.date)) as Set<string>
  const oldDaysSet = new Set(getDaysFromPeriod(oldPeriod).map((i: any) => i.date)) as Set<string>
  if (newDaysSet.size > oldDaysSet.size) return { added: newPeriod, deleted: oldPeriod }
  return {
    added: getPeriodFromDatesSet(diffSets(newDaysSet, oldDaysSet)),
    deleted: getPeriodFromDatesSet(diffSets(oldDaysSet, newDaysSet)),
  }
}

export default periodDifference
