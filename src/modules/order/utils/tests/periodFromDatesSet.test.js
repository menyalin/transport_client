import { getPeriodFromDatesSet } from '../periodDifference'
describe('getPeriodFromDatesSet', () => {
  it('is empty Set #1', () => {
    const period = getPeriodFromDatesSet(new Set())
    expect(Array.isArray(period)).toBeTruthy()
  })

  it('is empty Set #2', () => {
    const period = getPeriodFromDatesSet(new Set())
    expect(period.length).toBe(0)
  })

  it('is empty Set #3', () => {
    const period = getPeriodFromDatesSet(null)
    expect(period.length).toBe(0)
  })

  it('period #1', () => {
    const period = getPeriodFromDatesSet(new Set(['2022-01-05', '2022-01-01', '2022-01-03']))
    expect(period).toEqual(['2022-01-01', '2022-01-05'])
  })

  it('period #2', () => {
    const period = getPeriodFromDatesSet(new Set(['sdsds', '2022-01-01', '2022-01-05']))
    expect(period).toEqual(['2022-01-01', '2022-01-05'])
  })

  it('period #3', () => {
    const period = getPeriodFromDatesSet(new Set(['sdsds', '2232wde-01-01', '20dsds22-01-05']))
    expect(period).toEqual([])
  })

  it('period #4', () => {
    const period = getPeriodFromDatesSet(new Set(['2022-01-05']))
    expect(period).toEqual(['2022-01-05', '2022-01-05'])
  })

})
