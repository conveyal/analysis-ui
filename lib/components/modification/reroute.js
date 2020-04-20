import {faCrosshairs, faTimes} from '@fortawesome/free-solid-svg-icons'
import get from 'lodash/get'
import React, {Component} from 'react'

import {
  MAP_STATE_HIGHLIGHT_SEGMENT,
  MAP_STATE_HIGHLIGHT_STOP,
  MAP_STATE_SELECT_FROM_STOP,
  MAP_STATE_SELECT_TO_STOP
} from 'lib/constants'
import message from 'lib/message'

import {Button, Group} from '../buttons'
import Icon from '../icon'
import {Group as FormGroup} from '../input'

import EditAlignment from './edit-alignment'
import SelectFeedRouteAndPatterns from './select-feed-route-and-patterns'
import SegmentSpeeds from './segment-speeds'

/**
 * Reroute or extend an existing line.
 *
 * A reroute is specified with both a fromStop and toStop. Stops between those
 * stops in the baseline pattern will be replaced by the stops added through the
 * edit alignment functions in MAP_STATE_TRANSIT_EDITOR. In the transit editor,
 * allowExtend is set to false, because the start and end of the reroute are
 * already set by fromStop and toStop.
 *
 * An extension is specified with either a fromStop or toStop. Stops added
 * through the edit alignment functions in MAP_STATE_TRANSIT_EDITOR will be
 * added to the baseline pattern. If fromStop is set, extendFromEnd is set to
 * true, and stops are appended to the end of the baseline pattern. If
 * toStop is set, extendFromEnd is set to false, and stops are prepended to
 * the beginning of the baseline pattern. In both cases, allowExtend is true.
 */
export default class RerouteComponent extends Component {
  _highlightSegment = (segmentIndex) => {
    this.props.setMapState({
      state: MAP_STATE_HIGHLIGHT_SEGMENT,
      segmentIndex
    })
  }

  _highlightStop = (stopIndex) => {
    this.props.setMapState({
      state: MAP_STATE_HIGHLIGHT_STOP,
      stopIndex
    })
  }

  _selectFromStop = () => {
    const p = this.props
    p.setMapState({
      // don't allow extend if both fromStop and toStop are set.
      allowExtend: p.modification.toStop === null,
      // append stops to end of pattern
      extendFromEnd: true,
      state: MAP_STATE_SELECT_FROM_STOP
    })
  }

  _selectToStop = () => {
    const p = this.props
    p.setMapState({
      // don't allow extend if both fromStop and toStop are set.
      allowExtend: p.modification.fromStop === null,
      // prepend stops to beginning of pattern
      extendFromEnd: false,
      state: MAP_STATE_SELECT_TO_STOP
    })
  }

  _clearFromStop = () => {
    const p = this.props
    p.update({
      fromStop: null,
      toStop:
        p.modification.segments.length === 1 ? null : p.modification.toStop,
      segments: p.modification.segments.slice(1)
    })

    p.setMapState({state: null})
  }

  _clearToStop = () => {
    const p = this.props
    p.update({
      fromStop:
        p.modification.segments.length === 1 ? null : p.modification.fromStop,
      toStop: null,
      segments: p.modification.segments.slice(0, -1)
    })

    // Clear map state when editing alignments/selecting a stop.
    p.setMapState({state: null})
  }

  render() {
    const p = this.props
    const hasFeedAndRoutes = p.selectedFeed && p.modification.routes
    const fromStopValue = get(
      p.selectedFeed,
      `stopsById[${p.modification.fromStop}].stop_name`,
      '(none)'
    )
    const toStopValue = get(
      p.selectedFeed,
      `stopsById[${p.modification.toStop}].stop_name`,
      '(none)'
    )

    let numberOfStops = p.stops.length

    // don't include dwells at first and last stops
    if (p.modification.fromStop) numberOfStops--
    if (p.modification.toStop) numberOfStops--

    return (
      <>
        <SelectFeedRouteAndPatterns
          feeds={p.feeds}
          onChange={p.updateAndRetrieveFeedData}
          routePatterns={p.routePatterns}
          routes={p.modification.routes}
          selectedFeed={p.selectedFeed}
          trips={p.modification.trips}
        />

        {hasFeedAndRoutes && (
          <>
            <FormGroup>
              <label htmlFor='Select from stop'>
                {message('transitEditor.fromStopLabel')}
              </label>
              {fromStopValue}
              <Group justified>
                <Button
                  block
                  onClick={this._selectFromStop}
                  style='info'
                  title='Select from stop'
                >
                  <Icon icon={faCrosshairs} /> {message('common.select')}
                </Button>
                <Button
                  block
                  disabled={p.modification.fromStop == null}
                  onClick={this._clearFromStop}
                  style='danger'
                  title='Clear from stop'
                >
                  <Icon icon={faTimes} /> {message('common.clear')}
                </Button>
              </Group>
              <br />
              <label htmlFor='Select to stop'>
                {message('transitEditor.toStopLabel')}
              </label>
              {toStopValue}
              <Group justified>
                <Button
                  block
                  onClick={this._selectToStop}
                  style='info'
                  title='Select to stop'
                >
                  <Icon icon={faCrosshairs} /> {message('common.select')}
                </Button>
                <Button
                  block
                  disabled={p.modification.toStop == null}
                  onClick={this._clearToStop}
                  style='danger'
                  title='Clear to stop'
                >
                  <Icon icon={faTimes} /> {message('common.clear')}
                </Button>
              </Group>
            </FormGroup>

            <EditAlignment
              allowExtend={
                p.modification.toStop == null || p.modification.fromStop == null
              }
              extendFromEnd={p.modification.toStop == null}
              mapState={p.mapState}
              allStops={p.allStops}
              modification={p.modification}
              setMapState={p.setMapState}
              update={p.update}
              disabled={p.modification.segments.length < 1}
            />

            <SegmentSpeeds
              dwellTime={p.modification.dwellTime}
              dwellTimes={p.modification.dwellTimes || []}
              highlightSegment={this._highlightSegment}
              highlightStop={this._highlightStop}
              numberOfStops={numberOfStops}
              qualifiedStops={p.qualifiedStops}
              segmentDistances={p.segmentDistances}
              segmentSpeeds={p.modification.segmentSpeeds}
              update={p.update}
            />
          </>
        )}
      </>
    )
  }
}
