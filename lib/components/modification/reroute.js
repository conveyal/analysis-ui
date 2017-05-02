/** reroute an existing line. Takes a start and end stop ID, and replaces all stops between those with the specified routing/set of stops */

import React, {Component, PropTypes} from 'react'

import {Button} from '../buttons'
import {
  MAP_STATE_SELECT_FROM_STOP,
  MAP_STATE_SELECT_TO_STOP
} from '../../constants'
import Icon from '../icon'
import {Group} from '../input'

import EditAlignment from './edit-alignment'
import SelectFeedRouteAndPatterns from './select-feed-route-and-patterns'
import SegmentSpeeds from './segment-speeds'

export default class Reroute extends Component {
  static propTypes = {
    feeds: PropTypes.array.isRequired,
    modification: PropTypes.object.isRequired,
    mapState: PropTypes.object.isRequired,
    routePatterns: PropTypes.array.isRequired,
    segmentDistances: PropTypes.array.isRequired,
    selectedFeed: PropTypes.object,
    setMapState: PropTypes.func.isRequired,
    stops: PropTypes.array.isRequired,
    update: PropTypes.func.isRequired
  }

  _onSelectorChange = ({feed, routes, trips}) => {
    const {update} = this.props
    update({
      feed,
      routes,
      trips
    })
  }

  _selectFromStop = (e) => {
    this.props.setMapState({
      state: MAP_STATE_SELECT_FROM_STOP,
      modification: this.props.modification
    })
  }

  _selectToStop = (e) => {
    this.props.setMapState({
      state: MAP_STATE_SELECT_TO_STOP,
      modification: this.props.modification
    })
  }

  render () {
    const {
      feeds,
      mapState,
      modification,
      routePatterns,
      segmentDistances,
      selectedFeed,
      setMapState,
      stops,
      update
    } = this.props
    const hasFeedAndRoutes = selectedFeed && modification.routes
    const fromStopLabel = `From stop: ${modification.fromStop ? selectedFeed.stopsById[modification.fromStop].stop_name : '(none)'}`
    const toStopLabel = `To stop: ${modification.toStop ? selectedFeed.stopsById[modification.toStop].stop_name : '(none)'}`

    let numberOfStops = stops.length
    // don't include dwells at first and last stops
    if (modification.fromStop) numberOfStops--
    if (modification.toStop) numberOfStops--

    return (
      <div>
        <SelectFeedRouteAndPatterns
          feeds={feeds}
          onChange={this._onSelectorChange}
          routePatterns={routePatterns}
          routes={modification.routes}
          selectedFeed={selectedFeed}
          trips={modification.trips}
          />

        {hasFeedAndRoutes &&
          <div>
            <Group label={fromStopLabel}>
              <Button block onClick={this._selectFromStop} style='info'><Icon type='crosshairs' /> Select</Button>
            </Group>
            <Group label={toStopLabel}>
              <Button block onClick={this._selectToStop} style='info'><Icon type='crosshairs' /> Select</Button>
            </Group>
          </div>}

        <EditAlignment
          extendFromEnd={modification.toStop == null}
          mapState={mapState}
          modification={modification}
          setMapState={setMapState}
          update={update}
          />

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
}
