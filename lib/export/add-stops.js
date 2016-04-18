/** export an add-stops modification */

import { feedScopeIds } from './export'
import getHopTimes from '../map/transit-editor/get-hop-times'
import getStops from '../map/transit-editor/get-stops'

export default function convertAddStops (mod) {
  let out = { type: 'add-stops' }

  // feed-scope IDs
  out.fromStop = mod.fromStop !== null ? `${mod.feed}:${mod.fromStop}` : null
  out.toStop = mod.toStop !== null ? `${mod.feed}:${mod.toStop}` : null

  if (mod.trips != null) {
    out.trips = feedScopeIds(mod.feed, mod.trips)
  } else {
    out.routes = feedScopeIds(mod.feed, mod.routes)
  }

  let stops = getStops(mod)

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

  out.dwellTimes = out.stops.map((stop) => mod.dwell)
  out.hopTimes = getHopTimes(stops, mod.speed)

  return out
}
