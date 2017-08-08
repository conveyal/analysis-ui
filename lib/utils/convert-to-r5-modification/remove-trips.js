/** remove trips */

import {feedScopeIds} from './'

export default function convertRemoveTrips (mod) {
  const out = {type: 'remove-trips'}

  if (mod.trips != null) {
    out.patterns = feedScopeIds(mod.feed, mod.trips)
  } else {
    out.routes = feedScopeIds(mod.feed, mod.routes)
  }

  return out
}
