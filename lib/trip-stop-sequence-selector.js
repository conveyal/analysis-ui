/** select a trip and stop sequence */

import React, { Component, PropTypes } from 'react'

export default class TripStopSequenceSelector extends Component {
  static propTypes = {
    onChange: PropTypes.func,
    routes: PropTypes.array,
    stop: PropTypes.object,
    stops: PropTypes.array,
    stopSequence: PropTypes.string,
    trip: PropTypes.oject,
    trips: PropTypes.array
  }

  constructor (props) {
    super(props)
    this.changeRoute = this.changeRoute.bind(this)
    this.changeTrip = this.changeTrip.bind(this)
    this.changeStop = this.changeStop.bind(this)
    let trip = props.trips.find((t) => t.trip_id === props.trip)
    this.state = { route_id: trip ? trip.route_id : undefined, trip: trip }
  }

  changeRoute (e) {
    // choose a trip on this route
    let trip = this.props.trips.find((t) => t.route.route_id === e.target.value)
    this.props.onChange({ trip: trip.trip_id, stop: trip.stop_times[0].stop_sequence }) // choose first stop on trip, which may not have stop_sequence 0
  }

  changeTrip (e) {
    this.props.onChange({ trip: e.target.value, stop: this.props.stopSequence })
  }

  changeStop (e) {
    let stopSequence = e.target.value
    this.props.onChange({ trip: this.props.trip, stop: stopSequence })
  }

  setState (state) {
    super.setState(state)
  }

  componentWillReceiveProps (nextProps) {
    let trip = nextProps.trips.find((t) => t.trip_id === nextProps.trip)
    this.setState(Object.assign({}, this.state, { route_id: trip ? trip.route.route_id : undefined, trip: trip }))
  }

  render () {
    return <div style={{ padding: '10px', border: '1px solid #bbb' }}>
      <select onChange={this.changeRoute} value={this.state.route_id}>
        <option />
        {this.props.routes.map((r) => <option value={r.route_id} key={r.route_id}>{r.route_short_name} {r.route_long_name}</option>)}
      </select><br />

      <select onChange={this.changeTrip} value={this.state.trip ? this.state.trip.trip_id : ''}>
        {this.props.trips.filter((t) => t.route.route_id === this.state.route_id)
          .map((t) => {
            let stopName = this.props.stops.find((s) => s.stop_id === t.stop_times[t.stop_times.length - 1].stop_id).stop_name
            return <option key={t.trip_id} value={t.trip_id}>{t.stop_times.length} stops, toward {stopName}, ({t.trip_id})</option>
          })}
      </select>

      <select onChange={this.changeStop} value={this.props.stop}>
        <option />
        {!this.state.trip ? <option /> : this.state.trip.stop_times.map((st) => {
          let stop = this.props.stops.find((s) => s.stop_id === st.stop_id)
          return <option key={st.stop_sequence} value={st.stop_sequence}>{stop.stop_name}</option>
        })}
      </select>
    </div>
  }
}
