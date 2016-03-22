/** select stops on a particular route */

import React, { Component } from 'react'
import colors from './colors'

export default class SelectStops extends Component {
  static defaultProps = {
    unselectedStopMarker: {
      radius: 4,
      color: colors.NEUTRAL
    },
    selectedStopMarker: {
      radius: 4,
      color: colors.MODIFIED
    },
    nullIsWildcard: false
  };

  constructor (props) {
    super(props)

    this.newSelection = this.newSelection.bind(this)
    this.addToSelection = this.addToSelection.bind(this)
    this.removeFromSelection = this.removeFromSelection.bind(this)
    this.clearSelection = this.clearSelection.bind(this)

    this.state = { routeStops: this.getRouteStops(props) }
  }

  /** get the currently selected stop IDs, handling things like wildcards etc. */
  getSelectedStopIds () {
    let stops
    if (this.props.modification.stops) stops = this.props.modification.stops
    else if (this.props.nullIsWildcard) stops = this.state.routeStops.map((s) => s.stop_id)
    else stops = []
    return stops
  }

  componentWillReceiveProps (newProps) {
    this.setState(Object.assign({}, this.state, { routeStops: this.getRouteStops(newProps) }))
  }

  getRouteStops (props) {
    let routeStopIds = new Set()

    // data has not yet loaded
    if (!props.data.has(props.modification.feed)) {
      return []
    }

    let patterns = props.data.get(props.modification.feed).routes.get(props.modification.routes[0]).patterns

    // data has not yet been fetched
    if (patterns === undefined) {
      return []
    }

    if (props.modification.trips !== null) {
      patterns = patterns.filter((p) => {
        for (let trip of p.trips) {
          if (props.modification.trips.indexOf(trip.trip_id) > -1) return true
        }
        return false
      })
    }

    patterns.forEach((p) => {
      p.stops.forEach((s) => routeStopIds.add(s.stop_id))
    })

    let routeStops = [...routeStopIds].map((sid) => props.data.get(props.modification.feed).stops.get(sid))

    return routeStops
  }

  newSelection (e) {
    this.props.setMapState({
      state: 'stop-selection',
      action: 'new',
      modification: this.props.modification,
      routeStops: this.state.routeStops
    })
  }

  addToSelection (e) {
    this.props.setMapState({
      state: 'stop-selection',
      action: 'add',
      modification: this.props.modification,
      routeStops: this.state.routeStops
    })
  }

  removeFromSelection (e) {
    this.props.setMapState({
      state: 'stop-selection',
      action: 'remove',
      modification: this.props.modification,
      routeStops: this.state.routeStops
    })
  }

  clearSelection (e) {
    this.props.replaceModification(Object.assign({}, this.props.modification, { stops: null }))
  }

  render () {
    let stops = this.getSelectedStopIds()

    return <div>
      <button onClick={this.newSelection}>New selection</button>
      <button onClick={this.addToSelection}>Add to selection</button>
      <button onClick={this.removeFromSelection}>Remove from selection</button>
      <button onClick={this.clearSelection}>Clear selection</button>
      <ul>
        {(() => {
          let feed = this.props.data.get(this.props.modification.feed)
          if (feed === undefined) return <span /> // data not loaded

          if (this.state.routeStops.length === stops.length) return <li>(all stops)</li>
          else return stops.map((sid) => {
            let stop = feed.stops.get(sid)
            return <li data-id={stop.stop_id} key={stop.stop_id}>{stop.stop_name}</li>
          })
        })()}
      </ul>
    </div>
  }
}
