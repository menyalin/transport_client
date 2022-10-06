/* eslint-disable no-undef */
import getDaysFromPeriod from './getDaysFromPeriod'

describe('getDaysFromPeriod', () => {
  test('throw error if empty period ', () => {
    expect(() => {
      getDaysFromPeriod()
    }).toThrowError()
  })

  test('throw error if bad period 1', () => {
    expect(() => {
      getDaysFromPeriod([1, 2, 3])
    }).toThrowError()
  })
  test('throw error if bad period 2', () => {
    expect(() => {
      getDaysFromPeriod([1])
    }).toThrowError()
  })
  test('throw error if bad period 3', () => {
    expect(() => {
      getDaysFromPeriod(1)
    }).toThrowError()
  })
  test('throw error if bad period 4', () => {
    expect(() => {
      getDaysFromPeriod(['2021-01-04', '2021-01-01'])
    }).toThrowError()
  })
  test('throw error if bad period 5 - wrong date format', () => {
    expect(() => {
      getDaysFromPeriod(['2021-01-311', 'foo'])
    }).toThrowError()
  })
  test('throw error if bad period 6 - wrong date format', () => {
    expect(() => {
      getDaysFromPeriod(['2021-01-311', 'foo'])
    }).toThrowError()
  })
  test('example 1', () => {
    expect(getDaysFromPeriod(['2021-01-01', '2021-01-02'])).toHaveLength(2)
  })
  test('example 2', () => {
    expect(getDaysFromPeriod(['2021-01-01', '2021-01-01'])).toHaveLength(1)
  })
  test('example 3', () => {
    expect(getDaysFromPeriod(['2021-01-01', '2021-01-10'])).toHaveLength(10)
  })
})
