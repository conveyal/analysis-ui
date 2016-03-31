/** Select trips */

import React, { Component, PropTypes } from 'react'

import {Select} from './components/input'
import { toHhMm } from './timetable-entry'

export default class SelectTrip extends Component {
  static propTypes = {
    data: PropTypes.object.isRequired,
    trip: PropTypes.string,
    routes: PropTypes.array.isRequired,
    feed: PropTypes.string.isRequired,
    onChange: PropTypes.func,
    patternTrips: PropTypes.array
  }

  state = {
    trips: this.getTrips(this.props)
  }

  getTrips (props) {
    // we have pulled down all trips on the route but show only trips on this pattern
    let trips = []

    let feed = props.data.feeds.get(this.props.feed)

    if (feed == null) return [] // not loaded

    let patterns = feed.routes.get(this.props.routes[0]).patterns

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

  changeTrip = (e) => {
    this.props.onChange(e.target.value)
  }

  render () {
    return (
      <Select
        label='Trip'
        onChange={this.changeTrip}
        value={this.props.trip}
        >
        {this.state.trips.map((t) => {
          return <option value={t.trip_id} key={t.trip_id}>{t.trip_short_name ? t.trip_short_name + ' ' : (t.trip_headsign ? t.trip_headsign + ' ' : '')}, starting {toHhMm(t.start_time)} ({Math.round(t.duration / 60)} minute trip)</option>
        })}
      </Select>
    )
  }
}
