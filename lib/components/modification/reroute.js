/** reroute an existing line. Takes a start and end stop ID, and replaces all stops between those with the specified routing/set of stops */

import React, {Component, PropTypes} from 'react'

import {Button} from '../buttons'
import Icon from '../icon'
import {Group, Number, Checkbox} from '../input'
import SelectFeedRouteAndPatterns from './select-feed-route-and-patterns'
import SegmentSpeeds from './segment-speeds'
import messages from '../../utils/messages'
import {ADD_STOPS, SINGLE_STOP_SELECTION} from '../scenario-map/state'

export default class Reroute extends Component {
  static propTypes = {
    feeds: PropTypes.array.isRequired,
    feedsById: PropTypes.object.isRequired,
    modification: PropTypes.object.isRequired,
    mapState: PropTypes.object.isRequired,
    segmentDistances: PropTypes.array.isRequired,
    setMapState: PropTypes.func.isRequired,
    stops: PropTypes.array.isRequired,
    update: PropTypes.func.isRequired
  }

  state = getStateFromProps(this.props)

  componentWillReceiveProps (newProps) {
    this.setState(getStateFromProps(newProps))
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
      state: SINGLE_STOP_SELECTION,
      modification: this.props.modification,
      which: 'fromStop'
    })
  }

  selectToStop = (e) => {
    this.props.setMapState({
      state: SINGLE_STOP_SELECTION,
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

  /** toggle whether stops should be created automatically */
  onAutoCreateStopsChange = (e) => {
    const spacing = e.target.checked ? 400 : 0
    this.setState({...this.state, spacing})

    const {modification, update} = this.props
    update({segments: modification.segments.map((s) => ({...s, spacing}))})
  }

  /** set stop spacing */
  onStopSpacingChange = (e) => {
    const spacing = parseInt(e.target.value, 10)
    this.setState({...this.state, spacing})
    const spacingIsValid = spacing !== null && isNaN(spacing) && spacing >= 50
    if (spacingIsValid) { // user likely still typing
      const {modification, update} = this.props
      const {segments} = modification
      const currentSpacingIsNotZero = segments.length > 0 && segments[0].spacing > 0
      if (currentSpacingIsNotZero) {
        update({segments: segments.map((segment) => ({...segment, spacing}))})
      }
    }
  }

  render () {
    const {feeds, modification, segmentDistances, stops, update} = this.props
    const {followRoad, isEditingAlignment, selectedFeed, spacing} = this.state

    let numberOfStops = stops.length
    // don't include dwells at first and last stops
    if (modification.fromStop) numberOfStops--
    if (modification.toStop) numberOfStops--

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

        <SegmentSpeeds
          dwellTime={modification.dwellTime}
          numberOfStops={numberOfStops}
          segmentDistances={segmentDistances}
          segmentSpeeds={modification.segmentSpeeds}
          update={update}
          />

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

  return {
    followRoad: mapState.followRoad,
    isEditingAlignment: mapState && mapState.modificationId === modification.id && mapState.state === ADD_STOPS,
    selectedFeed: feedsById[modification.feed],
    spacing: modification.segments.length > 0 ? modification.segments[0].spacing : 400
  }
}
