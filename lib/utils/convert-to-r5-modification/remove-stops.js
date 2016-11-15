/** export a remove stops modification to r5 */

import { feedScopeIds } from './'

export default function convertRemoveStops (mod) {
  let out = {}
  out.type = 'remove-stops'

  out.stops = feedScopeIds(mod.feed, mod.stops)

  if (mod.trips !== null) {
    out.patterns = feedScopeIds(mod.feed, mod.trips)
  } else {
    out.routes = feedScopeIds(mod.feed, mod.routes)
  }

  return out
}
