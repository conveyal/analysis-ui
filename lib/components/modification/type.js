import dynamic from 'next/dynamic'
import React from 'react'

import AddTripPattern from 'lib/containers/add-trip-pattern'
import AdjustDwellTime from 'lib/containers/adjust-dwell-time'
import AdjustSpeed from 'lib/containers/adjust-speed'
import ConvertToFrequency from 'lib/containers/convert-to-frequency'
import RemoveStops from 'lib/containers/remove-stops'
import RemoveTrips from 'lib/containers/remove-trips'
import Reroute from 'lib/containers/reroute'

import * as C from 'lib/constants'

const AddStreets = dynamic(() => import('./add-streets'), {ssr: false})
const ModifyStreets = dynamic(() => import('./modify-streets'), {ssr: false})

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
