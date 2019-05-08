//
import {mockSurface} from '../../../utils/mock-data'
import createStraightLineSurface from '../straight-line'

describe('Actions > Analysis > Straight Line', () => {
  it('should correctly get time values for a surface', () => {
    const surface = createStraightLineSurface(
      {
        ...mockSurface,
        depth: 1
      },
      [-70, 57],
      100
    )
    expect(surface.get(5, 5)).toEqual([15])
  })
})
