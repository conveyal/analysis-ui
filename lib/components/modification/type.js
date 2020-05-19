import dynamic from 'next/dynamic'
import React from 'react'

import * as C from 'lib/constants'

const AddStreets = dynamic(() => import('./add-streets'))
const AddTripPattern = dynamic(() => import('lib/containers/add-trip-pattern'))
const AdjustDwellTime = dynamic(() => import('./adjust-dwell-time'))
const AdjustSpeed = dynamic(() => import('./adjust-speed'))
const ConvertToFrequency = dynamic(() =>
  import('lib/containers/convert-to-frequency')
)
const ModifyStreets = dynamic(() => import('./modify-streets'))
const RemoveStops = dynamic(() => import('./remove-stops'))
const RemoveTrips = dynamic(() => import('./remove-trips'))
const Reroute = dynamic(() => import('lib/containers/reroute'))

/**
 * Render the modification component for the given type.
 */
export default function Type(p) {
  switch (p.type) {
    case C.ADD_STREETS:
      return <AddStreets {...p} />
    case C.ADD_TRIP_PATTERN:
      return <AddTripPattern {...p} />
    case C.ADJUST_DWELL_TIME:
      return <AdjustDwellTime {...p} />
    case C.ADJUST_SPEED:
      return <AdjustSpeed {...p} />
    case C.CONVERT_TO_FREQUENCY:
      return <ConvertToFrequency {...p} />
    case C.MODIFY_STREETS:
      return <ModifyStreets {...p} />
    case C.REMOVE_STOPS:
      return <RemoveStops {...p} />
    case C.REMOVE_TRIPS:
      return <RemoveTrips {...p} />
    case C.REROUTE:
      return <Reroute {...p} />
    default:
      return null
  }
}
