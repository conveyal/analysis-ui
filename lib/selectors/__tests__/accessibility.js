// @flow
import {mockSurface, mockDestinationGrid} from '../../utils/mock-data'
import accessibility from '../accessibility'

const {describe, expect, it} = global
describe('selectors > accessibility', () => {
  it('should compute accessibility correctly', () => {
    const accessibilityVal = accessibility({
      analysis: {
        travelTimeSurface: mockSurface,
        profileRequest: {
          maxTripDurationMinutes: 10
        }
      },
      opportunityDatasets: {
        activeDataset: 'key',
        datasets: [{
          key: 'key',
          grid: mockDestinationGrid
        }]
      }
    })

    // the accessibility is 8 because the travel time surface is in four sections:
    // the upper-left, 2x2, is all reachable within 10 minutes median travel time, and
    // the lower-right, 3x3, is as well. However, the dest grid is slightly misaligned, so
    // one row and one column fall off the top and left.
    // The upper 3 rows of the destination grid contain one opportunity per cell, while the lower
    // two contain 2, so we see 4 * 1 = 4 opportunites from the upper-left, and 4 * 2 = 8 from the lower-right
    expect(accessibilityVal).toBe(12)
  })
})
