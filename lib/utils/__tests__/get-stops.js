/* global describe, expect, it */

import getStops from '../get-stops'

describe('Project-Map > Transit-Editor > getStops', () => {
  it('works correctly for a point', () => {
    const segments = [
      {
        fromStopId: '1',
        geometry: {
          type: 'Point',
          coordinates: [-122.0246, 36.9707]
        },
        stopAtStart: true
      }
    ]
    expect(getStops(segments)).toMatchSnapshot()
  })
})
