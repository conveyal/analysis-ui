/** A Modification in a report */
import message from '@conveyal/woonerf/message'
import React from 'react'

import {
  ADD_TRIP_PATTERN,
  ADJUST_DWELL_TIME,
  ADJUST_SPEED,
  CONVERT_TO_FREQUENCY,
  REMOVE_STOPS,
  REMOVE_TRIPS,
  REROUTE
} from '../../constants'

import AdjustFrequency from './adjust-frequency'
import AddTrips from './add-trips'
import RemoveTrips from './remove-trips'
import RemoveStops from './remove-stops'
import Reroute from './reroute'
import AdjustDwellTime from './adjust-dwell-time'
import AdjustSpeed from './adjust-speed'

export default function Modification (props) {
  const {modification, feedsById, index, total} = props
  const {type} = modification
  if (
    type !== ADD_TRIP_PATTERN &&
    feedsById[modification.feed] === undefined
  ) {
    return <div />
  }

  return (
    <div className='Report-Modification'>
      <h3>
        ({index} / {total}){' '}
        {message(`modificationType.${type}`) || type}
      </h3>
      <h2>
        {modification.name}
      </h2>

      {modification.description &&
        <i>
          {modification.description}
        </i>}

      {type === CONVERT_TO_FREQUENCY && <AdjustFrequency {...props} />}
      {type === ADD_TRIP_PATTERN && <AddTrips {...props} />}
      {type === REMOVE_TRIPS && <RemoveTrips {...props} />}
      {type === REMOVE_STOPS && <RemoveStops {...props} />}
      {type === REROUTE && <Reroute {...props} />}
      {type === ADJUST_DWELL_TIME && <AdjustDwellTime {...props} />}
      {type === ADJUST_SPEED && <AdjustSpeed {...props} />}
    </div>
  )
}
