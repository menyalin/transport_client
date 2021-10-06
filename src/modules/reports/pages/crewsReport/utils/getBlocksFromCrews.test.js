import getBlocksFromCrews from './getBlocksFromCrews'
import mockCrews from './mockCrews.json'

describe('getBlocksFromCrews', () => {
  it('bad params #1 ', () => {
    expect(() => {
      getBlocksFromCrews()
    }).toThrowError()
  })
  it('bad params #2 ', () => {
    expect(() => {
      getBlocksFromCrews(mockCrews, 'foo')
    }).toThrowError()
  })
  it('group on truck', () => {
    expect(getBlocksFromCrews(mockCrews, 'truck')).toHaveLength(7)
  })
})
