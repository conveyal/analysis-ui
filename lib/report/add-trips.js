/** The summary/report view of an add trip pattern modification */

import React, { Component, PropTypes } from 'react'
import lineDistance from 'turf-line-distance'
import {latLngBounds} from 'leaflet'

import messages from '../utils/messages'
import Distance from './distance'
import Speed from './speed'
import DaysOfService from './days-of-service'
import MiniMap from './mini-map'
import AddTripPatternLayer from '../scenario-map/add-trip-pattern-layer'
import {toHhMm} from '../components/timetable-entry'

export default class AddTrips extends Component {
  static propTypes = {
    modification: PropTypes.object.isRequired
  }

  render () {
    let { modification } = this.props

    let km = modification.segments
      .map(seg => lineDistance(seg.geometry, 'kilometers'))
      .reduce((a, b) => a + b)

    let bounds = latLngBounds(Array.concat(...modification.segments.map(seg => seg.geometry.coordinates.map(([lon, lat]) => [lat, lon]))))

    return <div>
      <MiniMap bounds={bounds}>
        <AddTripPatternLayer segments={modification.segments} />
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
          {modification.timetables.map(tt => this.renderEntry({ lengthKm: km, ...tt }))}
        </tbody>
      </table>
    </div>
  }

  // TODO duplicate code from adjust-frequency
  // ...rest will include days of service
  renderEntry = ({ name, startTime, speed, endTime, headwaySecs, sourceTrip, lengthKm, ...rest }) => {
    // TODO may be off by one, for instance ten-minute service for an hour will usually be 5 trips not 6
    let nTrips = Math.floor((endTime - startTime) / headwaySecs)

    let { modification } = this.props

    // bidirectional patterns have trips in each direction
    if (modification.bidirectional) nTrips *= 2

    return <tr>
      <td>{name}</td>
      <td>{toHhMm(startTime)}</td>
      <td>{toHhMm(endTime)}</td>
      <td>{Math.round(headwaySecs / 60)}</td>
      <td><Speed kmh={speed} /></td>
      <td><DaysOfService {...rest} /></td>
      <td>{nTrips}</td>
    </tr>
  }
}
