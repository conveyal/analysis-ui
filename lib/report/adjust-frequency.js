/** Display an adjust-frequency modification */

import React, { Component, PropTypes } from 'react'
import lineDistance from 'turf-line-distance'

import messages from '../utils/messages'
import {toHhMm} from '../components/timetable-entry'
import Distance from './distance'

export default class AdjustFrequency extends Component {
  static propTypes = {
    modification: PropTypes.object.isRequired,
    feedsById: PropTypes.object.isRequired
  }

  render () {
    let { modification, feedsById } = this.props
    let feed = feedsById[modification.feed]
    let route = feed.routesById[modification.routes[0]]
    return <div>
      <h3>{messages.scenario.route}: {!!route.route_short_name && route.route_short_name} {!!route.route_long_name && route.route_long_name}</h3>
      <i>{modification.retainTripsOutsideFrequencyEntries ? messages.report.keepTripsOutside : messages.report.removeTripsOutside }</i>

      <h4>{messages.report.newFrequencies}</h4>
      <table className='table table-striped'>
        <thead>
          <tr>
            <th>{messages.report.frequency.name}</th>
            <th>{messages.report.frequency.direction}</th>
            <th>{messages.report.frequency.startTime}</th>
            <th>{messages.report.frequency.endTime}</th>
            <th>{messages.report.frequency.frequency}</th>
            <th>{messages.report.frequency.daysOfService}</th>
            <th>{messages.report.nTrips}</th>
            <th>{messages.report.patternLength}</th>
          </tr>
        </thead>
        <tbody>
          {modification.entries.map(this.renderEntry)}
        </tbody>
      </table>
    </div>
  }

  renderEntry = ({ name, startTime, endTime, headwaySecs, sourceTrip, monday, tuesday, wednesday, thursday, friday, saturday, sunday }) => {
    if (sourceTrip == null) return [] // TODO this should not happen but can when a modification is brand-spankin'-new

    let { modification, feedsById } = this.props
    let feed = feedsById[modification.feed]
    let route = feed.routesById[modification.routes[0]]
    let pattern = route.patterns.find(p => p.trips.findIndex(t => t.trip_id === sourceTrip) > -1)
    let trip = pattern.trips.find(t => t.trip_id === sourceTrip)
    let km = lineDistance(pattern.geometry, 'kilometers')

    // TODO may be off by one, for instance ten-minute service for an hour will usually be 5 trips not 6
    let nTrips = Math.floor((endTime - startTime) / headwaySecs)

    return <tr>
      <td>{name}</td>
      <td>{trip.direction_id}</td>
      <td>{toHhMm(startTime)}</td>
      <td>{toHhMm(endTime)}</td>
      <td>{Math.round(headwaySecs / 60)}</td>
      <td>
        {monday && messages.report.days.monday}
        {tuesday && messages.report.days.tuesday}
        {wednesday && messages.report.days.wednesday}
        {thursday && messages.report.days.thursday}
        {friday && messages.report.days.friday}
        {saturday && messages.report.days.saturday}
        {sunday && messages.report.days.sunday}
      </td>
      <td>{nTrips}</td>
      <td><Distance km={km} /></td>
    </tr>
  }
}
