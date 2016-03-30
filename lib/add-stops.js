/** reroute an existing line. Takes a start and end stop ID, and replaces all stops between those with the specified routing/set of stops */

import React, { Component, PropTypes } from 'react'
import uuid from 'uuid'
import SelectRouteAndPatterns from './select-route-and-patterns'
import dbg from 'debug'

const debug = dbg('scenario-editor:add-stops')

export default class AddStops extends Component {
  static propTypes = {
    modification: PropTypes.object.isRequired,
    replaceModification: PropTypes.func.isRequired,
    setMapState: PropTypes.func.isRequired,
    data: PropTypes.object
  };

  constructor (props) {
    super(props)

    this.onNameChange = this.onNameChange.bind(this)
    this.onSelectorChange = this.onSelectorChange.bind(this)
    this.selectFromStop = this.selectFromStop.bind(this)
    this.selectToStop = this.selectToStop.bind(this)
    this.editAlignment = this.editAlignment.bind(this)
  }

  onNameChange (e) {
    this.props.replaceModification(Object.assign({}, this.props.modification, { name: e.target.value }))
  }

  onSelectorChange (value) {
    let { feed, routes, trips } = value
    let modification = Object.assign({}, this.props.modification, { feed, routes, trips })
    this.props.replaceModification(modification)
  }

  selectFromStop (e) {
    this.props.setMapState({
      state: 'single-stop-selection',
      modification: this.props.modification,
      which: 'fromStop'
    })
  }

  selectToStop (e) {
    this.props.setMapState({
      state: 'single-stop-selection',
      modification: this.props.modification,
      which: 'toStop'
    })
  }

  editAlignment (e) {
    this.props.setMapState({
      state: 'add-trip-pattern',
      modification: this.props.modification
    })
  }

  render () {
    return <div>
      <input type='text' placeholder='name' value={this.props.modification.name} onChange={this.onNameChange} />

      <SelectRouteAndPatterns routes={this.props.modification.routes} feed={this.props.modification.feed} trips={this.props.modification.trips} onChange={this.onSelectorChange} data={this.props.data} />

      {(() => {
        if (this.props.modification.feed && this.props.modification.routes) {
          let feed = this.props.data.feeds.get(this.props.modification.feed)
          if (feed == null) return <span></span> // data not loaded

          return <div>
            <div>
              From stop: {this.props.modification.fromStop != null ? feed.stops.get(this.props.modification.fromStop).stop_name : '(none)'} <button onClick={this.selectFromStop}>Select</button>
            </div>

            <div>
              To stop: {this.props.modification.toStop != null ? feed.stops.get(this.props.modification.toStop).stop_name : '(none)'} <button onClick={this.selectToStop}>Select</button>
            </div>
          </div>
        } else return <span></span>
      })()}

      <button onClick={this.editAlignment}>Edit alignment</button>
    </div>
  }
}

/** returns a new modification, with the stop ID updated. which is either fromStop or toStop. newStopId is the stop ID to set it to */
export function updateStop (modification, which, newStop, data) {
  // TODO should this function just clear geometry?
  // clone as needed
  modification = Object.assign({}, modification)
  modification.geometry = Object.assign({}, modification.geometry)
  modification.geometry.coordinates = [...modification.geometry.coordinates]
  modification.stops = [...modification.stops]
  modification.controlPoints = [...modification.controlPoints]
  modification.stopIds = [...modification.stopIds]

  // was there a stop set before? is there a stop set now?
  let stopWasSet = modification[which] !== null
  let stopNowSet = newStop !== null

  // stop IDs in add trip pattern/add stops modifications are feed-scoped
  let newStopId = newStop !== null ? `${modification.feed}:${newStop.stop_id}` : null

  if (which === 'fromStop') {
    // update the geometry
    if (stopWasSet && !stopNowSet) {
      modification.geometry.coordinates.shift()
      modification.stops.shift()
      modification.controlPoints.shift()
      modification.stopIds.shift()
    } else if (!stopWasSet && stopNowSet) {
      modification.geometry.coordinates.unshift([newStop.stop_lon, newStop.stop_lat])
      modification.stops.unshift(true)
      modification.controlPoints.unshift(true)
      modification.stopIds.unshift(newStopId)
    } else if (stopWasSet && stopNowSet) {
      modification.geometry.coordinates[0] = [newStop.stop_lon, newStop.stop_lat]
      modification.stopIds[0] = newStopId

      // these should be no-ops but they don't hurt anything
      modification.controlPoints[0] = true
      modification.stops[0] = true
    } else {
      // no change, nothing to do
    }

    // NB not feed scoped
    modification['fromStop'] = newStop.stop_id
  } else if (which === 'toStop') {
    // update the geometry
    if (stopWasSet && !stopNowSet) {
      modification.geometry.coordinates.pop()
      modification.stops.pop()
      modification.controlPoints.pop()
      modification.stopIds.pop()
    } else if (!stopWasSet && stopNowSet) {
      modification.geometry.coordinates.push([newStop.stop_lon, newStop.stop_lat])
      modification.stops.push(true)
      modification.controlPoints.push(true)
      modification.stopIds.push(newStopId)
    } else if (stopWasSet && stopNowSet) {
      let pos = modification.stops.length - 1
      modification.geometry.coordinates[pos] = [newStop.stop_lon, newStop.stop_lat]
      modification.stopIds[pos] = newStopId

      // these should be no-ops but they don't hurt anything
      modification.controlPoints[pos] = true
      modification.stops[pos] = true
    } else {
      // no change, nothing to do
    }

    // NB not feed scoped here
    modification['toStop'] = newStop.stop_id
  }

  // cannot have a modification with only one coordinate, that's an invalid line string
  if (modification.stops.length === 1) {
    // insert an extra stop, but figure out where to do it
    if (modification.fromStop !== null) {
      // end
      modification.geometry.coordinates.push([newStop.stop_lon + 0.002, newStop.stop_lat])
      modification.stops.push(true)
      modification.controlPoints.push(true)
      modification.stopIds.push(null)
    } else if (modification.toStop !== null) {
      // beginning
      modification.geometry.coordinates.unshift([newStop.stop_lon + 0.002, newStop.stop_lat])
      modification.stops.unshift(true)
      modification.controlPoints.unshift(true)
      modification.stopIds.unshift(null)
    } else {
      // panic can't happen.
      debug('After changing termini add-stops modification has only one point, but both ends are specified. Replacing entire routing.')
      let fromStop = data.feeds.get(modification.feed).stops.get(modification.fromStop)
      let toStop = data.feeds.get(modification.feed).stops.get(modification.toStop)

      modification.geometry.coordinates = [[fromStop.stop_lon, fromStop.stop_lat], [toStop.stop_lon, toStop.stop_lat]]
      modification.stops = [true, true]
      modification.controlPoints = [true, true]
      modification.stopIds = [fromStop.stop_id, toStop.stop_id]
    }
  }

  return modification
}

export function create () {
  return {
    type: 'add-stops',
    fromStopId: null,
    toStopId: null,
    feed: null,
    routes: null,
    name: '',
    showOnMap: true,
    expanded: true,
    id: uuid.v4(),
    geometry: {
      type: 'LineString',
      coordinates: []
    },
    stops: [],
    controlPoints: [],
    stopIds: []
  }
}
