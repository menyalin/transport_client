/* eslint-disable no-undef */
import getPeriodDiff from '../periodDifference'

test('new period great then oldPeriod', () => {
  const { added } = getPeriodDiff(['2022-06-01', '2022-06-02'], [])
  expect(added).toEqual(['2022-06-01', '2022-06-02'])
})

test('equal periods', () => {
  const { added, deleted } = getPeriodDiff(
    ['2022-06-01', '2022-06-02'],
    ['2022-06-01', '2022-06-02 ']
  )
  expect([added, deleted]).toEqual([[], []])
})
test('left shift', () => {
  const { added, deleted } = getPeriodDiff(
    ['2022-01-01', '2022-01-05'],
    ['2022-01-02', '2022-01-06']
  )
  expect([added, deleted]).toEqual([
    ['2022-01-01', '2022-01-01'],
    ['2022-01-06', '2022-01-06'],
  ])
})

test('right shift', () => {
  const { added, deleted } = getPeriodDiff(
    ['2022-01-03', '2022-01-06'],
    ['2022-01-01', '2022-01-03']
  )
  expect([added, deleted]).toEqual([
    ['2022-01-03', '2022-01-06'],
    ['2022-01-01', '2022-01-03'],
  ])
})
