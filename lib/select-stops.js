/** select stops on a particular route */

import React, { Component, PropTypes } from 'react'

export default class SelectStops extends Component {
  static propTypes = {
    feed: PropTypes.object.isRequired,
    modification: PropTypes.object.isRequired,
    nullIsWildcard: PropTypes.bool,
    replaceModification: PropTypes.func.isRequired,
    setMapState: PropTypes.func
  }

  state = {
    stops: getRouteStops(this.props)
  }

  componentWillReceiveProps (newProps) {
    this.setState(Object.assign({}, this.state, { stops: getRouteStops(newProps) }))
  }

  newSelection = (e) => {
    e.preventDefault()
    const {modification, setMapState} = this.props
    setMapState({
      state: 'stop-selection',
      action: 'new',
      modification,
      routeStops: this.state.stops
    })
  }

  addToSelection = (e) => {
    e.preventDefault()
    const {modification, setMapState} = this.props
    setMapState({
      state: 'stop-selection',
      action: 'add',
      modification,
      routeStops: this.state.stops
    })
  }

  removeFromSelection = (e) => {
    e.preventDefault()
    const {modification, setMapState} = this.props
    setMapState({
      state: 'stop-selection',
      action: 'remove',
      modification,
      routeStops: this.state.stops
    })
  }

  clearSelection = (e) => {
    e.preventDefault()
    this.props.replaceModification(Object.assign({}, this.props.modification, { stops: null }))
  }

  render () {
    const {feed, modification} = this.props
    const stopIds = modification.stops || []
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
      <ul>{feed && <SelectedStops selectedStops={stopIds.map(getStopFromFeed(feed))} />}</ul>
    </div>
  }
}

// TODO: This utility function should live outside of this component
function getRouteStops ({
  feed,
  modification
}) {
  const feedHasNotYetLoaded = !feed
  if (feedHasNotYetLoaded) {
    return []
  }
  let patterns = feed.routes.get(modification.routes[0]).patterns
  const patternsHaveNotYetLoaded = patterns === undefined
  if (patternsHaveNotYetLoaded) {
    return []
  }
  if (modification.trips !== null) {
    const patternTripsInModification = (m) => (p) => p.trips.find((t) => m.trips.indexOf(t.trip_id) > -1)
    patterns = patterns.filter(patternTripsInModification(modification))
  }
  const uniqueRouteStopIds = new Set()
  const addPatternsStopIds = (p) => p.stops.forEach((s) => uniqueRouteStopIds.add(s.stop_id))
  patterns.forEach(addPatternsStopIds)
  return [...uniqueRouteStopIds].map(getStopFromFeed(feed))
}

const SelectedStops = ({selectedStops}) =>
  selectedStops.map((stop) =>
    <li data-id={stop.stop_id} key={stop.stop_id}>{stop.stop_name}</li>)

const getStopFromFeed = (feed) => (stopId) => feed.stops.get(stopId)
