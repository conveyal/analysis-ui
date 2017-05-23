/* global describe, expect, it */

import {percentileCurves} from '../percentile-curves'
import {mockSurface, mockDestinationGrid} from '../../utils/mock-data'

describe('selectors > percentile curves', () => {
  it('should produce percentile curves', () => {
    const value = percentileCurves({
      analysis: {
        travelTimeSurface: mockSurface,
        destinationGrid: mockDestinationGrid
      }
    })

    // spot-check a few locations
    // 9 is median since we have every 5th perentile, see explanation in ./accessibility.js for
    // why we expect this to be 12
    expect(value[9][10]).toBe(12)
    expect(value[18][119]).toBe(24) // everything should be accessible, except the values off the top and left
    expect(value[5][1]).toBe(0)

    for (let percentileIdx = 0; percentileIdx < value.length; percentileIdx++) {
      for (let val = 1; val < 120; val++) {
        // should be increasing
        expect(value[percentileIdx][val] >= value[percentileIdx][val - 1]).toBeTruthy()

        if (percentileIdx > 1) {
          // higher percentiles of travel time should yield lower accessibility
          expect(value[percentileIdx][val] <= value[percentileIdx - 1][val]).toBeTruthy()
        }
      }
    }

    expect(value).toMatchSnapshot()
  })
})
