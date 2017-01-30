/** reroute an existing line. Takes a start and end stop ID, and replaces all stops between those with the specified routing/set of stops */

import React, {Component, PropTypes} from 'react'

import {Button} from '../buttons'
import Icon from '../icon'
import {Group} from '../input'
import {SINGLE_STOP_SELECTION} from '../scenario-map/state'

import EditAlignment from './edit-alignment'
import SelectFeedRouteAndPatterns from './select-feed-route-and-patterns'
import SegmentSpeeds from './segment-speeds'

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
      state: SINGLE_STOP_SELECTION,
      modification: this.props.modification,
      which: 'fromStop'
    })
  }

  _selectToStop = (e) => {
    this.props.setMapState({
      state: SINGLE_STOP_SELECTION,
      modification: this.props.modification,
      which: 'toStop'
    })
  }

  render () {
    const {feeds, feedsById, mapState, modification, segmentDistances, setMapState, stops, update} = this.props
    const selectedFeed = feedsById[modification.feed]
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
