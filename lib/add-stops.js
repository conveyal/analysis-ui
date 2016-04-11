/** reroute an existing line. Takes a start and end stop ID, and replaces all stops between those with the specified routing/set of stops */

import React, { Component, PropTypes } from 'react'
import dbg from 'debug'
import distance from 'turf-distance'
import point from 'turf-point'
import uuid from 'uuid'

import {Button} from './components/buttons'
import Icon from './components/icon'
import {Group, Number, Text} from './components/input'
import SelectRouteAndPatterns from './select-route-and-patterns'

const debug = dbg('scenario-editor:add-stops')

export default class AddStops extends Component {
  static propTypes = {
    modification: PropTypes.object.isRequired,
    replaceModification: PropTypes.func.isRequired,
    setMapState: PropTypes.func.isRequired,
    data: PropTypes.object
  }

  onNameChange = (e) => {
    this.props.replaceModification(Object.assign({}, this.props.modification, { name: e.target.value }))
  }

  onSelectorChange = (value) => {
    let { feed, routes, trips } = value
    let modification = Object.assign({}, this.props.modification, { feed, routes, trips })
    this.props.replaceModification(modification)
  }

  selectFromStop = (e) => {
    this.props.setMapState({
      state: 'single-stop-selection',
      modification: this.props.modification,
      which: 'fromStop'
    })
  }

  selectToStop = (e) => {
    this.props.setMapState({
      state: 'single-stop-selection',
      modification: this.props.modification,
      which: 'toStop'
    })
  }

  editAlignment = (e) => {
    this.props.setMapState({
      state: 'add-stops',
      modification: this.props.modification
    })
  }

  setSpeed = (e) => {
    let mod = Object.assign({}, this.props.modification, { speed: parseInt(e.target.value, 10) })
    this.props.replaceModification(mod)
  }

  setDwell = (e) => {
    let mod = Object.assign({}, this.props.modification, { dwell: parseInt(e.target.value, 10) })
    this.props.replaceModification(mod)
  }

  render () {
    const {modification} = this.props
    return (
      <div>
        <Text
          name='Name'
          onChange={this.onNameChange}
          value={modification.name}
          />

        <SelectRouteAndPatterns
          data={this.props.data}
          feed={modification.feed}
          onChange={this.onSelectorChange}
          routes={modification.routes}
          trips={modification.trips}
          />

        {this.renderStops()}

        <Number
          label='Speed (km/h):'
          onChange={this.setSpeed}
          value={modification.speed}
          />
        <Number
          label='Dwell time (seconds):'
          onChange={this.setDwell}
          step={1}
          value={modification.dwell}
          />

        <Button block onClick={this.editAlignment} style='warning'><Icon type='pencil' /> Edit alignment</Button>
      </div>
    )
  }

  renderStops () {
    const {modification} = this.props
    if (modification.feed && modification.routes) {
      const feed = this.props.data.feeds[modification.feed]
      if (feed) {
        const fromStopLabel = `From stop: ${modification.fromStop ? feed.stops.get(modification.fromStop).stop_name : '(none)'}`
        const toStopLabel = `To stop: ${modification.toStop ? feed.stops.get(modification.toStop).stop_name : '(none)'}`
        return (
          <div>
            <Group label={fromStopLabel}>
              <Button block onClick={this.selectFromStop} style='info'><Icon type='crosshairs' /> Select</Button>
            </Group>

            <Group label={toStopLabel}>
              <Button block onClick={this.selectToStop} style='info'><Icon type='crosshairs' />  Select</Button>
            </Group>
          </div>
        )
      }
    }
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
      // if the length is only two coordinates, delete the first because it was just automatically created so there
      // wouldn't be a line string of length 0, but only if it's a control point not a stop (to ensure we only delete things we created)

      if (modification.stops.length === 2 && !modification.stops[0]) {
        modification.stops.shift()
        modification.controlPoints.shift()
        modification.stopIds.shift()
        modification.geometry.coordinates.shift()
      }

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
    modification.fromStop = newStop.stop_id
  } else if (which === 'toStop') {
    // update the geometry
    if (stopWasSet && !stopNowSet) {
      modification.geometry.coordinates.pop()
      modification.stops.pop()
      modification.controlPoints.pop()
      modification.stopIds.pop()
    } else if (!stopWasSet && stopNowSet) {
      if (modification.stops.length === 2 && !modification.stops[1]) {
        modification.stops.pop()
        modification.controlPoints.pop()
        modification.stopIds.pop()
        modification.geometry.coordinates.pop()
      }

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
    modification.toStop = newStop.stop_id
  }

  // cannot have a modification with only one coordinate, that's an invalid line string
  if (modification.stops.length === 1) {
    // insert an extra control point, but figure out where to do it
    if (modification.fromStop !== null) {
      // end
      modification.geometry.coordinates.push([newStop.stop_lon + 0.002, newStop.stop_lat])
      modification.stops.push(false)
      modification.controlPoints.push(true)
      modification.stopIds.push(null)
    } else if (modification.toStop !== null) {
      // beginning
      modification.geometry.coordinates.unshift([newStop.stop_lon + 0.002, newStop.stop_lat])
      modification.stops.unshift(false)
      modification.controlPoints.unshift(true)
      modification.stopIds.unshift(null)
    } else {
      // panic can't happen.
      debug('After changing termini add-stops modification has only one point, but both ends are specified. Replacing entire routing.')
      let fromStop = data.feeds[modification.feed].stops.get(modification.fromStop)
      let toStop = data.feeds[modification.feed].stops.get(modification.toStop)

      modification.geometry.coordinates = [[fromStop.stop_lon, fromStop.stop_lat], [toStop.stop_lon, toStop.stop_lat]]
      modification.stops = [true, true]
      modification.controlPoints = [true, true]
      modification.stopIds = [fromStop.stop_id, toStop.stop_id]
    }
  }

  return modification
}

/** get { hopTimes, dwellTimes } for this modification */
export function getTimes (mod) {
  // one dwell time at each stop. Note that the alignment here includes the start and end stops, if applicable.
  let dwellTimes = mod.stops.filter((s) => s).map((s) => mod.dwell)

  // hop times: a bit more tricky
  let hopTimes = []

  for (let i = 0, accumulatedDistanceKm = 0; i < mod.stops.length - 1; i++) {
    // add the length of the segment from i to i + 1
    accumulatedDistanceKm += distance(point(mod.geometry.coordinates[i]), point(mod.geometry.coordinates[i + 1]), 'kilometers')

    // if true, we're at the end of a hop
    if (mod.stops[i + 1]) {
      // NB using round not floor so that error has expectation 0
      hopTimes.push(Math.round(accumulatedDistanceKm * 3600 / mod.speed))
      accumulatedDistanceKm = 0 // reset for next hop
    }
  }

  return { hopTimes, dwellTimes }
}

export function create (data) {
  return {
    type: 'add-stops',
    fromStop: null,
    toStop: null,
    feed: Object.keys(data.feeds)[0],
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
    stopIds: [],
    speed: 15,
    dwell: 0
  }
}
