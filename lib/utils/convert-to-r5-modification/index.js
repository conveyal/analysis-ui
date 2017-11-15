/** Export a project as r5-compatible JSON */

import convertAddTripPattern from './add-trip-pattern'
import convertAdjustDwellTime from './adjust-dwell-time'
import convertAdjustSpeed from './adjust-speed'
import convertConvertToFrequency from './convert-to-frequency'
import convertRemoveStops from './remove-stops'
import convertRemoveTrips from './remove-trips'
import convertReroute from './reroute'

/** feed scope route, stop, trip ids. if called with null, returns null. if called with undefined, returns undefined */
export function feedScopeIds (feed, ids) {
  if (ids === undefined) return undefined
  else if (ids === null) return null
  return ids.map(id => `${feed}:${id}`)
}

export default function convertToR5Modification (originalModification) {
  let mod
  switch (originalModification.type) {
    case 'add-trip-pattern':
      mod = convertAddTripPattern(originalModification)
      break
    case 'adjust-dwell-time':
      mod = convertAdjustDwellTime(originalModification)
      break
    case 'adjust-speed':
      mod = convertAdjustSpeed(originalModification)
      break
    case 'convert-to-frequency':
      mod = convertConvertToFrequency(originalModification)
      break
    case 'remove-stops':
      mod = convertRemoveStops(originalModification)
      break
    case 'remove-trips':
      mod = convertRemoveTrips(originalModification)
      break
    case 'add-stops':
    case 'reroute':
      mod = convertReroute(originalModification)
  }

  mod.comment = originalModification.name

  return mod
}
