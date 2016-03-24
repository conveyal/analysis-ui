/** Export a scenario as r5-compatible JSON */

import dbg from 'debug'
import convertAddTripPattern from './add-trip-pattern'

let debug = dbg('scenario-editor:export')

/** feed scope route, stop, trip ids */
export function feedScopeIds (feed, ids) {
  return ids.map(id => `${feed}:${id}`)
}

export default function convertToR5Modification (originalModification) {
  let mod
  switch (originalModification.type) {
    case 'add-trip-pattern':
      mod = convertAddTripPattern(originalModification)
  }

  return mod
}
