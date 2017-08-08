/** export an adjust-speed modification */

import {feedScopeIds} from './'

export default function convertAdjustSpeed (mod) {
  const out = {}
  out.type = 'adjust-speed'

  if (mod.trips === null) {
    out.routes = feedScopeIds(mod.feed, mod.routes)
  } else {
    out.patterns = feedScopeIds(mod.feed, mod.trips)
  }

  // we can use feedscopeids here as hop is an array of 2 stop ids
  out.hops =
    mod.hops !== null ? mod.hops.map(hop => feedScopeIds(mod.feed, hop)) : null

  out.scale = mod.scale

  return out
}
