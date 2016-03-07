/** Select trips */

import React, { Component } from 'react'
import { toHhMm } from './timetable-entry'

const GTFS_API = 'http://localhost:4567'

export default class SelectTrip extends Component {
  constructor (props) {
    super(props)

    this.state = { trips: [] }

    this.updateState(props)

    this.changeTrip = this.changeTrip.bind(this)
  }

  updateState (props) {
    fetch(`${GTFS_API}/trips?feed=${props.feed}&route=${props.routes[0]}`).then((res) => res.json())
      .then((trips) => {
        // we have pulled down all trips on the route but show only trips on this pattern
        trips = trips.filter((t) => this.props.patternTrips.indexOf(t.trip_id) > -1)
        trips.sort((a, b) => a.start_time - b.start_time)
        this.setState(Object.assign({}, this.state, { trips }))
      })
  }

  componentWillReceiveProps (newProps) {
    this.updateState(newProps)
  }

  changeTrip (e) {
    this.props.onChange(e.target.value)
  }

  render () {
    return <select value={this.props.trip} onChange={this.changeTrip}>
      {this.state.trips.map((t) => {
        return <option value={t.trip_id} key={t.trip_id}>{t.trip_short_name ? t.trip_short_name + ' ' : (t.trip_headsign ? t.trip_headsign + ' ' : '')}, starting {toHhMm(t.start_time)} ({Math.round(t.trip_length_seconds / 60)} minute trip)</option>
      })}
    </select>
  }
}
