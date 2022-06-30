import {diffSets} from '../periodDifference'

describe('diffSets function', () => {
  test('#1', () => {
    const  diff =  diffSets(new Set([1, 2, 3]), new Set([2,3]))
    expect(diff.has(1)).toBeTruthy()
  })

  test('#2', () => {
    const  diff =  diffSets(new Set([2, 3]), new Set([2,3]))
    expect(diff.size).toBe(0)
  })

  test('#3', () => {
    const  diff =  diffSets(new Set([2, 3, 5, 7, 9]), new Set([2,3]))
    expect(diff.has(8)).toBeFalsy()
  })
  test('#4', () => {
    const  diff =  diffSets(new Set([2, 3, 5, 7, 9]), new Set([2,3]))
    expect(diff.has(3)).toBeFalsy()
  })

  test('#5', () => {
    const  diff =  diffSets(new Set(['2', '3', '4']), new Set(['2', '3']))
    expect(diff.has('4')).toBeTruthy()
  })
})


