/** export a remove stops modification to r5 */

import {feedScopeIds} from './'

export default function convertRemoveStops (mod) {
  const out = {}
  out.type = 'remove-stops'

  out.stops = feedScopeIds(mod.feed, mod.stops)

  if (mod.trips !== null) {
    out.patterns = feedScopeIds(mod.feed, mod.trips)
  } else {
    out.routes = feedScopeIds(mod.feed, mod.routes)
  }

  // only write out the secondsSavedAtEachStop if nonzero to retain backwards-compatibility. On newer
  // versions of R5 the default is 0, on older versions this field did not exist.
  if (mod.secondsSavedAtEachStop > 0) {
    out.secondsSavedAtEachStop = mod.secondsSavedAtEachStop
  }

  return out
}
