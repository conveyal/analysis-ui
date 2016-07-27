/** reroute an existing line. Takes a start and end stop ID, and replaces all stops between those with the specified routing/set of stops */

import React, {Component, PropTypes} from 'react'
import dbg from 'debug'

import {Button} from './components/buttons'
import Icon from './components/icon'
import {Group, Number, Checkbox} from './components/input'
import SelectFeedRouteAndPatterns from './select-feed-route-and-patterns'
import messages from './messages'
import getStops from './scenario-map/transit-editor/get-stops'

const debug = dbg('scenario-editor:add-stops')

export default class AddStops extends Component {
  static propTypes = {
    feeds: PropTypes.array.isRequired,
    feedsById: PropTypes.object.isRequired,
    modification: PropTypes.object.isRequired,
    mapState: PropTypes.object.isRequired,
    replaceModification: PropTypes.func.isRequired,
    setMapState: PropTypes.func.isRequired
  }

  constructor (props) {
    super(props)
    this.state = this.getStateFromProps(props)
  }

  /** extract current stop spacing from a modification */
  getStateFromProps (props) {
    const {feedsById, mapState, modification} = props
    const stops = getStops(modification)
    const nStops = stops.length
    const distanceFromStart = nStops > 0 ? stops.slice(-1)[0].distanceFromStart : 0
    const dwellSeconds = modification.dwell

    let travelTime = 0
    if (nStops > 0) {
      travelTime = distanceFromStart / 1000 / modification.speed * 60
      // add the dwell times
      const dwellMinutes = dwellSeconds / 60
      travelTime += nStops * dwellMinutes

      // don't include dwell time at first and last stop of reroute
      if (!modification.fromStop) travelTime -= dwellMinutes
      if (!modification.toStop) travelTime -= dwellMinutes
    }

    return {
      distanceFromStart,
      dwellSeconds,
      followRoad: mapState.followRoad,
      isEditingAlignment: mapState && mapState.modificationId === modification.id && mapState.state === 'add-stops',
      nStops,
      selectedFeed: feedsById[modification.feed],
      spacing: modification.segments.length > 0 ? modification.segments[0].spacing : 400,
      travelTimeMinutes: Math.round(travelTime)
    }
  }

  componentWillReceiveProps (newProps) {
    this.setState(this.getStateFromProps(newProps))
  }

  onSelectorChange = ({feed, routes, trips}) => {
    const {modification, replaceModification} = this.props
    replaceModification({
      ...modification,
      feed,
      routes,
      trips
    })
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
      modificationId: this.props.modification.id,
      extendFromEnd: this.props.modification.toStop == null,
      followRoad: this.state.followRoad,
      // if one or the other end is free, allow extending the modification
      allowExtend: this.props.modification.toStop == null || this.props.modification.fromStop == null
    })
  }

  onFollowRoadChange = (e) => {
    this.props.setMapState({
      state: 'add-stops',
      modificationId: this.props.modification.id,
      extendFromEnd: this.props.modification.toStop == null,
      followRoad: e.target.checked,
      // if one or the other end is free, allow extending the modification
      allowExtend: this.props.modification.toStop == null || this.props.modification.fromStop == null
    })
  }

  stopEditingAlignment = (e) => {
    this.props.setMapState({})
  }

  setSpeed = (e) => {
    const {modification, replaceModification} = this.props
    replaceModification({
      ...modification,
      speed: parseInt(e.target.value, 10)
    })
  }

  setDwell = (e) => {
    const {modification, replaceModification} = this.props
    replaceModification({
      ...modification,
      dwell: parseInt(e.target.value, 10)
    })
  }

  /** toggle whether stops should be created automatically */
  onAutoCreateStopsChange = (e) => {
    const spacing = e.target.checked ? 400 : 0
    this.setState({...this.state, spacing})

    const {modification, replaceModification} = this.props
    const segments = modification.segments
      // TODO store spacing in modification separately from per-segment spacing?
      .map((segment) => Object.assign({}, segment, {spacing}))

    replaceModification({
      ...modification,
      segments
    })
  }

  /** set stop spacing */
  onStopSpacingChange = (e) => {
    const spacing = parseInt(e.target.value, 10)
    this.setState({...this.state, spacing})
    const spacingIsValid = spacing !== null && isNaN(spacing) && spacing >= 50
    if (spacingIsValid) { // user likely still typing
      const {modification, replaceModification} = this.props
      let {segments} = modification
      const currentSpacingIsNotZero = segments.length > 0 && segments[0].spacing > 0
      if (currentSpacingIsNotZero) {
        replaceModification({
          ...modification,
          segments: segments.map((segment) => Object.assign({}, segment, {spacing}))
        })
      }
    }
  }

  setSpeedFromTravelTime = (e) => {
    const {modification, replaceModification} = this.props
    let {distanceFromStart, dwellSeconds, nStops} = this.state
    // figure out appropriate speed given this travel time
    const travelTimeMinutes = parseFloat(e.target.value)
    const travelTimeIsValid = travelTimeMinutes !== null && !isNaN(travelTimeMinutes)
    if (travelTimeIsValid && nStops !== 0) {
      // don't include dwells at first and last stops
      if (modification.fromStop) nStops--
      if (modification.toStop) nStops--
      const totalDwellSeconds = nStops * dwellSeconds
      const travelTimeSeconds = (travelTimeMinutes * 60) - totalDwellSeconds
      // figure out speed
      const speedMps = distanceFromStart / travelTimeSeconds
      const speedKph = Math.round(speedMps * 3600 / 1000)
      replaceModification({
        ...modification,
        speed: speedKph
      })
    }
  }

  render () {
    const {feeds, modification} = this.props
    const {dwellSeconds, followRoad, isEditingAlignment, selectedFeed, spacing, travelTimeMinutes} = this.state

    // not using state here as otherwise checkbox would toggle on and off as you're editing the stop spacing
    const autoCreateStops = modification.segments.length > 0 ? modification.segments[0].spacing > 0 : true
    return (
      <div>
        <SelectFeedRouteAndPatterns
          feeds={feeds}
          onChange={this.onSelectorChange}
          routes={modification.routes}
          selectedFeed={selectedFeed}
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
          value={dwellSeconds}
          />

        <Number
          label='Length of segment (mins)'
          onChange={this.setSpeedFromTravelTime}
          value={travelTimeMinutes}
          />

        {isEditingAlignment &&
          <div>
            <Button
              block
              onClick={this.stopEditingAlignment}
              style='warning'
              ><Icon type='pencil' /> Stop editing alignment
            </Button>
            <Checkbox
              checked={followRoad}
              label={messages.transitEditor.followRoad}
              onChange={this.onFollowRoadChange}
              />
          </div>
        }
        {!isEditingAlignment &&
          <Button
            block
            onClick={this.editAlignment}
            style='warning'
            ><Icon type='pencil' /> Edit alignment
          </Button>
        }

        <Checkbox
          checked={autoCreateStops}
          label={messages.transitEditor.autoCreateStops}
          onChange={this.onAutoCreateStopsChange}
          />

        {autoCreateStops &&
          <Number
            value={spacing}
            label={messages.transitEditor.stopSpacingMeters}
            onChange={this.onStopSpacingChange}
            />
        }

      </div>
    )
  }

  renderStops () {
    const {modification} = this.props
    const {selectedFeed} = this.state
    const hasFeedAndRoutes = selectedFeed && modification.routes
    if (hasFeedAndRoutes) {
      const fromStopLabel = `From stop: ${modification.fromStop ? selectedFeed.stopsById[modification.fromStop].stop_name : '(none)'}`
      const toStopLabel = `To stop: ${modification.toStop ? selectedFeed.stopsById[modification.toStop].stop_name : '(none)'}`
      return (
        <div>
          <Group label={fromStopLabel}>
            <Button block onClick={this.selectFromStop} style='info'><Icon type='crosshairs' /> Select</Button>
          </Group>
          <Group label={toStopLabel}>
            <Button block onClick={this.selectToStop} style='info'><Icon type='crosshairs' /> Select</Button>
          </Group>
        </div>
      )
    }
  }
}

/** returns a new modification, with the stop ID updated. which is either fromStop or toStop. newStop is the stop obj to set it to */
export function updateStop ({modification, which, newStop, feed}) {
  modification = Object.assign({}, modification)

  const fromStop = which === 'fromStop' ? newStop : feed.stopsById[modification.fromStop]
  const toStop = which === 'toStop' ? newStop : feed.stopsById[modification.toStop]

  debug(`fromStop: ${fromStop}, toStop: ${toStop}`)

  if (fromStop == null) {
    modification.segments = [{
      geometry: {
        type: 'Point',
        coordinates: [toStop.stop_lon, toStop.stop_lat]
      },
      stopAtStart: true,
      stopAtEnd: true,
      fromStopId: `${modification.feed}:${toStop.stop_id}`,
      toStopId: `${modification.feed}:${toStop.stop_id}`,
      spacing: 400
    }]
  } else if (toStop == null) {
    modification.segments = [{
      geometry: {
        type: 'Point',
        coordinates: [fromStop.stop_lon, fromStop.stop_lat]
      },
      stopAtStart: true,
      stopAtEnd: true,
      fromStopId: `${modification.feed}:${fromStop.stop_id}`,
      toStopId: `${modification.feed}:${fromStop.stop_id}`,
      spacing: 400
    }]
  } else {
    modification.segments = [{
      geometry: {
        type: 'LineString',
        coordinates: [
          [fromStop.stop_lon, fromStop.stop_lat],
          [toStop.stop_lon, toStop.stop_lat]
        ]
      },
      stopAtStart: true,
      stopAtEnd: true,
      fromStopId: `${modification.feed}:${fromStop.stop_id}`,
      toStopId: `${modification.feed}:${toStop.stop_id}`,
      spacing: 400
    }]
  }

  modification.fromStop = fromStop != null ? fromStop.stop_id : null
  modification.toStop = toStop != null ? toStop.stop_id : null

  return modification
}
