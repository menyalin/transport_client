import getRowsFromCrews from './getRowsFromCrews'

import mockRows from './mockCrews.json'

describe('getDaysFromPeriod', () => {
  test('bad arguments #1', () => {
    expect(() => {
      getRowsFromCrews()
    }).toThrowError()
  })
  test('bad arguments #2', () => {
    expect(() => {
      getRowsFromCrews([])
    }).toThrowError()
  })
  test('bad arguments #3', () => {
    expect(() => {
      getRowsFromCrews([], 'foo')
    }).toThrowError()
  })
  test('normal params #4', () => {
    expect(getRowsFromCrews(mockRows, 'truck').length).toBe(2)
  })
})
