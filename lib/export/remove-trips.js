/** remove trips */

import { feedScopeIds } from './export'

export default function convertRemoveTrips (mod) {
  let out = { type: 'remove-trips' }

  if (mod.trips != null) {
    out.trips = feedScopeIds(mod.feed, mod.trips)
  } else {
    out.routes = feedScopeIds(mod.feed, mod.routes)
  }

  return out
}
