/** The summary/report view of an add trip pattern modification */

import {latLngBounds} from 'leaflet'
import React, { Component, PropTypes } from 'react'
import lineDistance from '@turf/line-distance'

import DaysOfService from './days-of-service'
import Distance from './distance'
import MiniMap from './mini-map'
import AddTripPatternLayer from '../scenario-map/add-trip-pattern-layer'
import Speed from './speed'
import messages from '../../utils/messages'
import {getAverageSpeedOfSegments} from '../../utils/segments'
import {secondsToHhMmString} from '../../utils/time'

export default class AddTrips extends Component {
  static propTypes = {
    modification: PropTypes.object.isRequired
  }

  render () {
    const {modification} = this.props
    const segmentDistances = modification.segments
      .map(seg => lineDistance(seg.geometry, 'kilometers'))

    const km = segmentDistances.reduce((a, b) => a + b)
    const bounds = latLngBounds(Array.concat(...modification.segments.map(seg => seg.geometry.coordinates.map(([lon, lat]) => [lat, lon]))))

    return <div>
      <MiniMap bounds={bounds}>
        <AddTripPatternLayer
          bidirectional
          segments={modification.segments}
          />
      </MiniMap>

      <i><Distance km={km} />, { modification.bidirectional ? messages.report.addTrips.bidirectional : messages.report.addTrips.unidirectional }</i>

      <table className='table table-striped'>
        <thead>
          <tr>
            <th>{messages.report.frequency.name}</th>
            <th>{messages.report.frequency.startTime}</th>
            <th>{messages.report.frequency.endTime}</th>
            <th>{messages.report.frequency.frequency}</th>
            <th>{messages.report.frequency.speed}</th>
            <th>{messages.report.frequency.daysOfService}</th>
            <th>{messages.report.frequency.nTrips}</th>
          </tr>
        </thead>
        <tbody>
          {modification.timetables.map((tt, i) =>
            <TimeTable
              bidirectional={modification.bidirectional}
              key={`add-trips-entry-${i}`}
              lengthKm={km}
              segmentDistances={segmentDistances}
              {...tt}
              />)}
        </tbody>
      </table>
    </div>
  }
}

// TODO duplicate code from adjust-frequency
// ...rest will include days of service
function TimeTable ({
  bidirectional,
  endTime,
  headwaySecs,
  lengthKm,
  name,
  sourceTrip,
  segmentSpeeds,
  segmentDistances,
  startTime,
  ...rest
}) {
  // TODO may be off by one, for instance ten-minute service for an hour will usually be 5 trips not 6
  const nTrips = Math.floor((endTime - startTime) / headwaySecs)

  const speed = getAverageSpeedOfSegments({ segmentSpeeds, segmentDistances })

  return <tr>
    <td>{name}</td>
    <td>{secondsToHhMmString(startTime)}</td>
    <td>{secondsToHhMmString(endTime)}</td>
    <td>{Math.round(headwaySecs / 60)}</td>
    <td><Speed kmh={speed} /></td>
    <td><DaysOfService {...rest} /></td>
    <td>{bidirectional ? nTrips * 2 : nTrips}</td>
  </tr>
}
