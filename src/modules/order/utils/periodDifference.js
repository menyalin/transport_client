import getDaysFromPeriod from '../../../modules/common/helpers/getDaysFromPeriod'
import dayjs from 'dayjs'

export const diffSets = (a, b) => {
  const _diffSet = new Set(a)
  b.forEach(i => _diffSet.delete(i))
  return _diffSet
}

export const getPeriodFromDatesSet = set => {
  if (!set || !set?.size) return []
  const res = []
  set.forEach(i => !isNaN(Date.parse(i)) && res.push(dayjs(i).format('YYYY-MM-DD')))
  res.sort((a, b) => new Date(a) - new Date(b))
  return [res[0], res[res.length - 1]]
}

export default (newPeriod, oldPeriod = []) => {
  if (oldPeriod.length === 0) return { added: newPeriod, deleted: [] }
  const newDaysSet = new Set(getDaysFromPeriod(newPeriod).map(i => i.date))
  const oldDaysSet = new Set(getDaysFromPeriod(oldPeriod).map(i => i.date))
  if (newDaysSet.size > oldDaysSet.size) return { added: newPeriod, deleted: oldPeriod }
  return {
    added: getPeriodFromDatesSet(diffSets(newDaysSet, oldDaysSet)),
    deleted: getPeriodFromDatesSet(diffSets(oldDaysSet, newDaysSet)),
  }
}
