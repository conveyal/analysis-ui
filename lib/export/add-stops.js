/** export an add-stops modification */

import { feedScopeIds } from './export'

export default function convertAddStops (mod) {
  let out = { type: 'add-stop' }

  // feed-scope IDs
  out.fromStop = mod.fromStop !== null ? `${mod.feed}:${mod.fromStop}` : null
  out.toStop = mod.toStop !== null ? `${mod.feed}:${mod.toStop}` : null

  if (mod.trips != null) {
    out.trips = feedScopeIds(mod.feed, mod.trips)
  } else {
    out.routes = feedScopeIds(mod.feed, mod.routes)
  }

  out.stops = []

  console.log(mod)

  for (let i = 0; i < mod.stops.length; i++) {
    if (!mod.stops[i]) continue

    if (mod.stopIds[i] != null) {
      // existing stops, already feed scoped
      out.stops.push({ stopId: mod.stopIds[i] })
    } else {
      // new stops
      let [ lon, lat ] = mod.geometry.coordinates[i]
      out.stops.push({ lon, lat })
    }
  }

  // don't include from and to stop in modification
  if (out.fromStop != null) {
    let stop = out.stops.shift()

    if (stop.stopId !== out.fromStop) {
      throw new Error('First stop in reroute is not fromStop!')
    }
  }

  if (out.toStop != null) {
    let stop = out.stops.pop()

    if (stop.stopId !== out.toStop) {
      throw new Error('Last stop in reroute is not toStop!')
    }
  }

  out.hopTimes = out.stops.map((s) => 60)

  if (out.fromStop != null && out.toStop != null) {
    out.hopTimes.push(60)
  }

  // nb using mod because we also reset dwell for from and to
  out.dwellTimes = mod.stops.map((s) => 0)

  return out
}
