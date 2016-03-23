/** Select trips */

import React, { Component } from 'react'
import { toHhMm } from './timetable-entry'

export default class SelectTrip extends Component {
  constructor (props) {
    super(props)

    this.state = { trips: this.getTrips(props) }

    this.changeTrip = this.changeTrip.bind(this)
  }

  getTrips (props) {
    // we have pulled down all trips on the route but show only trips on this pattern
    let trips = []
    let patterns = props.data.feeds.get(this.props.feed).routes.get(this.props.routes[0]).patterns

    // data has not loaded yet
    if (patterns === undefined) return []

    patterns.forEach((pat) => {
      pat.trips.forEach((trip) => trips.push(trip))
    })

    trips = trips.filter((t) => this.props.patternTrips.indexOf(t.trip_id) > -1)
    trips.sort((a, b) => a.start_time - b.start_time)
    return trips
  }

  componentWillReceiveProps (newProps) {
    this.setState(Object.assign({}, this.state, { trips: this.getTrips(newProps) }))
  }

  changeTrip (e) {
    this.props.onChange(e.target.value)
  }

  render () {
    return <select value={this.props.trip} onChange={this.changeTrip}>
      {this.state.trips.map((t) => {
        return <option value={t.trip_id} key={t.trip_id}>{t.trip_short_name ? t.trip_short_name + ' ' : (t.trip_headsign ? t.trip_headsign + ' ' : '')}, starting {toHhMm(t.start_time)} ({Math.round(t.duration / 60)} minute trip)</option>
      })}
    </select>
  }
}
