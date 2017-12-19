// @flow

import getHopTimes from '../get-hop-times'

function makeStops () {
  const stops = []

  for (let i = 0; i < 7; i++) {
    stops.push({
      // every other stop is bona fide
      stopId: i % 2 === 0 ? `stop-${i}` : undefined,
      // thus, the segment of each stop is half the stop index
      index: Math.floor(i / 2),
      bearing: 10,
      autoCreated: i % 2 === 0,
      distanceFromStart: i * 100
    })
  }

  return stops
}

describe('Project-Map > Transit-Editor > getHopTimes', () => {
  it('works correctly', () => {
    const stops = makeStops()

    // the first segment contains two stops 100m apart, it should take 10 seconds to get from the
    // first to the second, and to get to the first stop of the next segment it should also take
    // ten seconds, and so on
    expect(getHopTimes(stops, [36, 72, 36])).toEqual([10, 10, 5, 5, 10, 10])
  })
})
