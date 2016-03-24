/** export adjusted dwell times */

import { feedScopeIds } from './export'

export default function convertAdjustDwellTime (mod) {
  let out = {}
  out.type = 'adjust-dwell-time'
  out.routes = feedScopeIds(mod.feed, mod.routes)
  out.trips = feedScopeIds(mod.feed, mod.routes)
  out.stops = feedScopeIds(mod.feed, mod.stops)

  if (mod.scale) out.scale = mod.value
  else out.dwellSecs = mod.value

  return out
}
