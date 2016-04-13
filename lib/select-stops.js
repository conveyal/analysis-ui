/** select stops on a particular route */

import React, { Component, PropTypes } from 'react'

export default class SelectStops extends Component {
  static propTypes = {
    data: PropTypes.object.isRequired,
    modification: PropTypes.object.isRequired,
    nullIsWildcard: PropTypes.bool,
    replaceModification: PropTypes.func.isRequired,
    setMapState: PropTypes.func
  }

  state = {
    routeStops: this.getRouteStops(this.props)
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
    if (!props.data.feeds[props.modification.feed]) {
      return []
    }

    let patterns = props.data.feeds[props.modification.feed].routes.get(props.modification.routes[0]).patterns

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

    let routeStops = [...routeStopIds].map((sid) => props.data.feeds[props.modification.feed].stops.get(sid))

    return routeStops
  }

  newSelection = (e) => {
    e.preventDefault()
    this.props.setMapState({
      state: 'stop-selection',
      action: 'new',
      modification: this.props.modification,
      routeStops: this.state.routeStops
    })
  }

  addToSelection = (e) => {
    e.preventDefault()
    this.props.setMapState({
      state: 'stop-selection',
      action: 'add',
      modification: this.props.modification,
      routeStops: this.state.routeStops
    })
  }

  removeFromSelection = (e) => {
    e.preventDefault()
    this.props.setMapState({
      state: 'stop-selection',
      action: 'remove',
      modification: this.props.modification,
      routeStops: this.state.routeStops
    })
  }

  clearSelection = (e) => {
    e.preventDefault()
    this.props.replaceModification(Object.assign({}, this.props.modification, { stops: null }))
  }

  render () {
    return <div>
      <div className='form-group'>
        <label>Selection</label>
        <div className='btn-group btn-group-justified'>
          <a className='btn btn-sm btn-default' onClick={this.newSelection}>New</a>
          <a className='btn btn-sm btn-default' onClick={this.addToSelection}>Add to</a>
          <a className='btn btn-sm btn-default' onClick={this.removeFromSelection}>Remove from</a>
          <a className='btn btn-sm btn-default' onClick={this.clearSelection}>Clear</a>
        </div>
      </div>
      <ul>{this.renderStops()}</ul>
    </div>
  }

  renderStops () {
    const feed = this.props.data.feeds[this.props.modification.feed]
    if (feed !== undefined) {
      const stops = this.getSelectedStopIds()
      if (this.state.routeStops.length === stops.length) return <li>(all stops)</li>
      else {
        return stops.map((sid) => {
          const stop = feed.stops.get(sid)
          return <li data-id={stop.stop_id} key={stop.stop_id}>{stop.stop_name}</li>
        })
      }
    }
  }
}
