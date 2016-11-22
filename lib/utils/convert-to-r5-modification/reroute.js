/** export a reroute modification */

import { feedScopeIds } from './'
import getHopTimes from '../get-hop-times'
import getStops from '../get-stops'

export default function convertReroute (mod) {
  let out = { type: 'reroute' }

  // feed-scope IDs
  out.fromStop = mod.fromStop !== null ? `${mod.feed}:${mod.fromStop}` : null
  out.toStop = mod.toStop !== null ? `${mod.feed}:${mod.toStop}` : null

  if (mod.trips != null) {
    out.patterns = feedScopeIds(mod.feed, mod.trips)
  } else {
    out.routes = feedScopeIds(mod.feed, mod.routes)
  }

  let stops = getStops(mod.segments)

  out.stops = stops.map((stop) => {
    // already feed scoped
    if (stop.stopId != null) {
      return { id: stop.stopId }
    } else {
      return {
        lat: stop.lat,
        lon: stop.lon
      }
    }
  })

  // don't include from and to stop in modification
  if (out.fromStop != null) {
    let stop = out.stops.shift()

    if (stop.id !== out.fromStop) {
      throw new Error('First stop in reroute is not fromStop!')
    }
  }

  if (out.toStop != null) {
    let stop = out.stops.pop()

    if (stop.id !== out.toStop) {
      throw new Error('Last stop in reroute is not toStop!')
    }
  }

  out.hopTimes = getHopTimes(stops, mod.speed)

  // There should be one more dwell time than hop time. The number of hop times depends on fromStop and toStop.
  out.dwellTimes = out.hopTimes.map((hop) => mod.dwell)
  out.dwellTimes.push(mod.dwell)

  return out
}
