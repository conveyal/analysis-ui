/** Set phasing between two existing trips */

import React, { Component } from 'react'
import TripStopSequenceSelector from './trip-stop-sequence-selector'
import uuid from 'uuid'

import authenticatedFetch from './utils/authenticated-fetch'

// TODO FIXME avert your gaze, this is super hacky
const FEED_ID = 'IndyConnect_final_scenario'
const GTFS_API_URL = 'http://localhost:4567/api'

export default class SetTripPhasing extends Component {
  constructor (props) {
    super(props)

    this.changeSource = this.changeSource.bind(this)
    this.changeTarget = this.changeTarget.bind(this)
    this.changePhase = this.changePhase.bind(this)

    this.state = { trips: [], routes: [], stops: [] }

    // get the trips and all their stop times
    let routePromise = authenticatedFetch(`${GTFS_API_URL}/routes?feed=${FEED_ID}`).then(res => res.json())
    let tripPromise = authenticatedFetch(`${GTFS_API_URL}/trips?feed=${FEED_ID}`).then(res => res.json())
    let stopPromise = authenticatedFetch(`${GTFS_API_URL}/stops?feed=${FEED_ID}`).then(res => res.json())

    Promise.all([routePromise, tripPromise, stopPromise]).then(([routes, trips, stops]) => {
      Promise.all(
        trips.map(t =>
          authenticatedFetch(`${GTFS_API_URL}/trips/${t.trip_id}/stoptimes?feed=${FEED_ID}`).then(res => res.json())
        )
      ).then(stopTimeArray => {
        stopTimeArray.forEach((st, i) => trips[i].stop_times = st)
        this.setState({ trips, routes, stops })
      })
    })
  }

  changeSource (source) {
    let modification = Object.assign({}, this.props.modification)
    modification.sourceTripId = source.trip
    modification.sourceStopSequence = Number(source.stop)
    this.props.replaceModification(modification)
  }

  changeTarget (target) {
    let modification = Object.assign({}, this.props.modification)
    modification.targetTripId = target.trip
    modification.targetStopSequence = Number(target.stop)
    this.props.replaceModification(modification)
  }

  changePhase (e) {
    this.props.replaceModification(Object.assign({}, this.props.modification, { phaseSeconds: e.target.value * 60 }))
  }

  render () {
    return <div>
        <TripStopSequenceSelector trips={this.state.trips} routes={this.state.routes} stops={this.state.stops} onChange={this.changeSource} trip={this.props.modification.sourceTripId} stop={this.props.modification.sourceStopSequence} />
        <TripStopSequenceSelector trips={this.state.trips} routes={this.state.routes} stops={this.state.stops} onChange={this.changeTarget} trip={this.props.modification.targetTripId} stop={this.props.modification.targetStopSequence}/>
        <input type='text' value={this.props.modification.phaseSeconds / 60} onChange={this.changePhase} />
      </div>
  }
}

export function create () {
  return {
    phaseSeconds: 15 * 60,
    id: uuid.v4(),
    type: 'set-trip-phasing',
    expanded: true,
    showOnMap: true
  }
}
