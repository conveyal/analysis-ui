/** Export a scenario as r5-compatible JSON */

import convertAddTripPattern from './add-trip-pattern'
import convertAdjustDwellTime from './adjust-dwell-time'
import convertAdjustSpeed from './adjust-speed'
import convertConvertToFrequency from './convert-to-frequency'
import convertRemoveStops from './remove-stops'
import convertRemoveTrips from './remove-trips'

/** feed scope route, stop, trip ids. if called with null, returns null. if called with undefined, returns undefined */
export function feedScopeIds (feed, ids) {
  if (ids === undefined) return undefined
  else if (ids === null) return null
  return ids.map((id) => `${feed}:${id}`)
}

export default function convertToR5Modification (originalModification) {
  let mod
  switch (originalModification.type) {
    case 'add-trip-pattern':
      return convertAddTripPattern(originalModification)
    case 'adjust-dwell-time':
      return convertAdjustDwellTime(originalModification)
    case 'adjust-speed':
      return convertAdjustSpeed(originalModification)
    case 'convert-to-frequency':
      return convertConvertToFrequency(originalModification)
    case 'remove-stops':
      return convertRemoveStops(originalModification)
    case 'remove-trips':
      return convertRemoveTrips(originalModification)
  }

  return mod
}
