/* global describe, expect, it */

import getHopTimes from '../get-hop-times'

describe('Scenario-Map > Transit-Editor > getHopTimes', () => {
  it('works correctly', () => {
    const stops = [{
      distanceFromStart: 0
    }, {
      distanceFromStart: 123
    }]
    expect(getHopTimes(stops, 32)).toMatchSnapshot()
  })
})
