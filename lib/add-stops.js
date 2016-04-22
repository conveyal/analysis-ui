/** reroute an existing line. Takes a start and end stop ID, and replaces all stops between those with the specified routing/set of stops */

import React, { Component, PropTypes } from 'react'
import dbg from 'debug'
import uuid from 'uuid'

import {Button} from './components/buttons'
import Icon from './components/icon'
import {Group, Number, Text, Checkbox} from './components/input'
import SelectRouteAndPatterns from './select-route-and-patterns'
import messages from './messages'

const debug = dbg('scenario-editor:add-stops')

export default class AddStops extends Component {
  static propTypes = {
    modification: PropTypes.object.isRequired,
    mapState: PropTypes.object.isRequired,
    replaceModification: PropTypes.func.isRequired,
    setMapState: PropTypes.func.isRequired,
    data: PropTypes.object
  }

  constructor (props) {
    super(props)
    this.state = this.getStateFromProps(props)
  }

  /** extract current stop spacing from a modification */
  getStateFromProps (props) {
    let { modification } = props
    return {
      spacing: modification.segments.length > 0 ? modification.segments[0].spacing : 400
    }
  }

  componentWillReceiveProps (newProps) {
    this.setState(Object.assign({}, this.state, this.getStateFromProps(newProps)))
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
      modificationId: this.props.modification.id,
      extendFromEnd: this.props.modification.toStop == null,
      // if one or the other end is free, allow extending the modification
      allowExtend: this.props.modification.toStop == null || this.props.modification.fromStop == null
    })
  }

  stopEditingAlignment = (e) => {
    this.props.setMapState({})
  }

  setSpeed = (e) => {
    let mod = Object.assign({}, this.props.modification, { speed: parseInt(e.target.value, 10) })
    this.props.replaceModification(mod)
  }

  setDwell = (e) => {
    let mod = Object.assign({}, this.props.modification, { dwell: parseInt(e.target.value, 10) })
    this.props.replaceModification(mod)
  }

  /** toggle whether stops should be created automatically */
  onAutoCreateStopsChange = (e) => {
    let spacing = e.target.checked ? 400 : 0
    this.setState(Object.assign({}, this.state, { spacing }))

    let segments = this.props.modification.segments
      // TODO store spacing in modification separately from per-segment spacing?
      .map((s) => Object.assign({}, s, { spacing }))

    this.props.replaceModification(Object.assign({}, this.props.modification, { segments }))
  }

  /** set stop spacing */
  onStopSpacingChange = (e) => {
    let segments = this.props.modification.segments

    let spacing = parseInt(e.target.value, 10)

    this.setState(Object.assign({}, this.state, { spacing }))

    if (spacing == null || isNaN(spacing) || spacing < 50) return // user likely still typing

    // only set stop spacing if current spacing is not zero
    if (segments.length > 0 && segments[0].spacing > 0) {
      segments = segments.map((s) => Object.assign({}, s, { spacing }))
      this.props.replaceModification(Object.assign({}, this.props.modification, { segments }))
    }
  }

  render () {
    const {modification, mapState} = this.props

    // not using state here as otherwise checkbox would toggle on and off as you're editing the stop spacing
    let autoCreateStops = modification.segments.length > 0 ? modification.segments[0].spacing > 0 : true

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

        {mapState != null && mapState.modificationId === modification.id && mapState.state === 'add-stops'
          ? <Button block onClick={this.stopEditingAlignment} style='warning'><Icon type='pencil' /> Stop editing alignment</Button>
          : <Button block onClick={this.editAlignment} style='warning'><Icon type='pencil' /> Edit alignment</Button>}

        <Checkbox
          checked={autoCreateStops}
          label={messages.transitEditor.autoCreateStops}
          onChange={this.onAutoCreateStopsChange}
          />

        {autoCreateStops
          ? <Number
            value={this.state.spacing}
            label={messages.transitEditor.stopSpacingMeters}
            onChange={this.onStopSpacingChange}
            />
          : []}

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

/** returns a new modification, with the stop ID updated. which is either fromStop or toStop. newStop is the stop obj to set it to */
export function updateStop (modification, which, newStop, data) {
  modification = Object.assign({}, modification)

  let feed = data.feeds[modification.feed]

  let fromStop = which === 'fromStop' ? newStop : feed.stops.get(modification.fromStop)
  let toStop = which === 'toStop' ? newStop : feed.stops.get(modification.toStop)

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
    segments: [],
    speed: 15,
    dwell: 0
  }
}
