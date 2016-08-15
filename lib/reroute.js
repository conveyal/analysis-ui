/** reroute an existing line. Takes a start and end stop ID, and replaces all stops between those with the specified routing/set of stops */

import React, {Component, PropTypes} from 'react'

import {Button} from './components/buttons'
import Icon from './components/icon'
import {Group, Number, Checkbox} from './components/input'
import SelectFeedRouteAndPatterns from './select-feed-route-and-patterns'
import messages from './messages'
import getStops from './scenario-map/transit-editor/get-stops'
import {ADD_STOPS} from './scenario-map/state'

export default class Reroute extends Component {
  static propTypes = {
    feeds: PropTypes.array.isRequired,
    feedsById: PropTypes.object.isRequired,
    modification: PropTypes.object.isRequired,
    mapState: PropTypes.object.isRequired,
    setMapState: PropTypes.func.isRequired,
    update: PropTypes.func.isRequired
  }

  state = getStateFromProps(this.props)

  componentWillReceiveProps (newProps) {
    this.setState(getStateFromProps(newProps))
  }

  componentDidMount () {
    // set extents
  }

  onSelectorChange = ({feed, routes, trips}) => {
    const {update} = this.props
    update({
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
      state: ADD_STOPS,
      modificationId: this.props.modification.id,
      extendFromEnd: this.props.modification.toStop == null,
      followRoad: this.state.followRoad,
      // if one or the other end is free, allow extending the modification
      allowExtend: this.props.modification.toStop == null || this.props.modification.fromStop == null
    })
  }

  onFollowRoadChange = (e) => {
    this.props.setMapState({
      state: ADD_STOPS,
      modificationId: this.props.modification.id,
      extendFromEnd: this.props.modification.toStop == null,
      followRoad: e.target.checked,
      // if one or the other end is free, allow extending the modification
      allowExtend: this.props.modification.toStop == null || this.props.modification.fromStop == null
    })
  }

  stopEditingAlignment = (e) => {
    this.props.setMapState({
      state: null,
      modificationId: null
    })
  }

  setSpeed = (e) => {
    this.props.update({
      speed: parseInt(e.target.value, 10)
    })
  }

  setDwell = (e) => {
    this.props.update({
      dwell: parseInt(e.target.value, 10)
    })
  }

  /** toggle whether stops should be created automatically */
  onAutoCreateStopsChange = (e) => {
    const spacing = e.target.checked ? 400 : 0
    this.setState({...this.state, spacing})

    const {modification, update} = this.props
    const segments = modification.segments
      // TODO store spacing in modification separately from per-segment spacing?
      .map((segment) => Object.assign({}, segment, {spacing}))

    update({segments})
  }

  /** set stop spacing */
  onStopSpacingChange = (e) => {
    const spacing = parseInt(e.target.value, 10)
    this.setState({...this.state, spacing})
    const spacingIsValid = spacing !== null && isNaN(spacing) && spacing >= 50
    if (spacingIsValid) { // user likely still typing
      const {modification, update} = this.props
      let {segments} = modification
      const currentSpacingIsNotZero = segments.length > 0 && segments[0].spacing > 0
      if (currentSpacingIsNotZero) {
        update({
          segments: segments.map((segment) => Object.assign({}, segment, {spacing}))
        })
      }
    }
  }

  setSpeedFromTravelTime = (e) => {
    const {modification, update} = this.props
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
      update({speed: speedKph})
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

/** extract current stop spacing from a modification */
function getStateFromProps (props) {
  const {feedsById, mapState, modification} = props
  const stops = getStops(modification.segments)
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
    isEditingAlignment: mapState && mapState.modificationId === modification.id && mapState.state === ADD_STOPS,
    nStops,
    selectedFeed: feedsById[modification.feed],
    spacing: modification.segments.length > 0 ? modification.segments[0].spacing : 400,
    travelTimeMinutes: Math.round(travelTime)
  }
}
