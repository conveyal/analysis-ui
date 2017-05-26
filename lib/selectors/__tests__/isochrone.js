/* global describe, it, expect */

import isochrone from '../isochrone'
import {mockSurface} from '../../utils/mock-data'

describe('selectors > isochrone', () => {
  it('should interpolate isochrone correctly', () => {
    const iso = isochrone({
      analysis: {
        travelTimeSurface: mockSurface,
        isochroneCutoff: 10
      }
    })

    expect(iso).toMatchSnapshot()
  })
})
