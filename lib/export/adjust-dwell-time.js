/** export adjusted dwell times */

import { feedScopeIds } from './export'

export default function convertAdjustDwellTime (mod) {
  let out = {}
  out.type = 'adjust-dwell-time'

  if (mod.trips === null) {
    out.routes = feedScopeIds(mod.feed, mod.routes)
  } else {
    out.trips = feedScopeIds(mod.feed, mod.trips)
  }

  out.stops = feedScopeIds(mod.feed, mod.stops)

  if (mod.scale) out.scale = mod.value
  else out.dwellSecs = mod.value

  return out
}
