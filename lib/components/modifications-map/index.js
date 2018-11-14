// @flow
import React from 'react'

import {
  ADD_TRIP_PATTERN,
  ADJUST_DWELL_TIME,
  ADJUST_SPEED,
  CONVERT_TO_FREQUENCY,
  MAP_STATE_HIGHLIGHT_SEGMENT,
  MAP_STATE_HIGHLIGHT_STOP,
  MAP_STATE_HOP_SELECTION,
  MAP_STATE_STOP_SELECTION,
  MAP_STATE_SELECT_FROM_STOP,
  MAP_STATE_SELECT_TO_STOP,
  MAP_STATE_TRANSIT_EDITOR,
  REMOVE_STOPS,
  REMOVE_TRIPS,
  REROUTE
} from '../../constants'
import colors from '../../constants/colors'
import updateAddStopsTerminus from '../../utils/update-add-stops-terminus'
import type {Feed, Modification, Stop} from '../../types'

import AddTripPatternLayer from './add-trip-pattern-layer'
import AdjustSpeedLayer from './adjust-speed-layer'
import HopSelectPolygon from './hop-select-polygon'
import PatternLayer from './pattern-layer'
import PatternStopsLayer from './pattern-stops-layer'
import RerouteLayer from './reroute-layer'
import StopLayer from './stop-layer'
import StopSelectPolygon from './stop-select-polygon'
import TransitEditor from './transit-editor'

type Props = {
  activeModification?: Object,
  activeModificationFeed?: Feed,
  bundleId: string,
  feeds: Feed[],
  feedsById: {
    [feedId: string]: Feed
  },
  mapState: Object,
  modificationsOnMap: any[],
  qualifiedStops: Stop[],
  updateLocally: (any) => void,
  setMapState: Object => void
}

/**
 * A map component showing a project
 */
export default class ModificationsMap extends React.Component {
  props: Props

  render () {
    const {
      activeModification,
      feedsById,
      mapState,
      modificationsOnMap
    } = this.props
    // Add trip pattern modifications do not have a feed property but should still be shown on the map.
    const dim = id => activeModification && activeModification._id !== id

    return (
      <g>
        {/* show patterns at the bottom */}
        {modificationsOnMap
          .filter(m => m.type === REMOVE_TRIPS)
          .map(m => (
            <PatternLayer
              color={colors.REMOVED}
              dim={dim(m._id)}
              feed={feedsById[m.feed]}
              key={m._id}
              modification={m}
            />
          ))}
        {modificationsOnMap
          .filter(m => m.type === CONVERT_TO_FREQUENCY)
          .map(m => (
            <PatternLayer
              activeTrips={mapState.activeTrips}
              activeModification={activeModification}
              color={colors.MODIFIED}
              dim={dim(m._id)}
              feed={feedsById[m.feed]}
              key={m._id}
              modification={m}
            />
          ))}
        {/* show patterns with added or removed stop in neutral gray, the stops/reroutes themselves will be shown as red or blue depending on whether they are removed or added. */}
        {modificationsOnMap
          .filter(m => m.type === REMOVE_STOPS || m.type === ADJUST_DWELL_TIME)
          .map(m => (
            <PatternStopsLayer
              selectedStopColor={
                m.type === REMOVE_STOPS ? colors.REMOVED : colors.MODIFIED
              }
              dim={dim(m._id)}
              nullIsWildcard={m.type === ADJUST_DWELL_TIME}
              feed={feedsById[m.feed]}
              key={m._id}
              modification={m}
            />
          ))}
        {modificationsOnMap
          .filter(m => m.type === ADJUST_SPEED)
          .map(m => (
            <AdjustSpeedLayer
              key={`adjust-speed-${m._id}`}
              dim={dim(m._id)}
              feed={feedsById[m.feed]}
              modification={m}
            />
          ))}
        {modificationsOnMap
          .filter(m => m.type === REROUTE)
          .map(m => (
            <RerouteLayer
              dim={dim(m._id)}
              feed={feedsById[m.feed]}
              highlightSegment={this.getHighlightSegmentForModification(m)}
              highlightStop={this.getHighlightStopForModification(m)}
              key={`reroute-layer-${m._id}`}
              modification={m}
              showAddedSegment={
                mapState.state !== MAP_STATE_TRANSIT_EDITOR ||
                  !activeModification ||
                  activeModification._id !== m._id
              }
            />
          ))}
        {/* Added trip patterns. */}
        {modificationsOnMap
          .filter(m => m.type === ADD_TRIP_PATTERN)
          // hide trip pattern currently being edited
          .filter(
            (m) =>
              !activeModification ||
              m._id !== activeModification._id ||
              mapState.state !== MAP_STATE_TRANSIT_EDITOR
          )
          // if there's only a single stop, don't render
          .filter(
            (m) =>
              m.segments.length > 0 && m.segments[0].geometry.type !== 'Point'
          )
          .map(m => (
            <AddTripPatternLayer
              key={`add-trip-pattern-layer-${m._id}`}
              bidirectional={m.bidirectional}
              highlightSegment={this.getHighlightSegmentForModification(m)}
              highlightStop={this.getHighlightStopForModification(m)}
              segments={m.segments}
            />
          ))}
        {/* state-specific layers */}
        {this.renderStateSpecificLayers()}
      </g>
    )
  }

  getHighlightSegmentForModification (modification: Modification): number {
    const {activeModification, mapState} = this.props
    return !activeModification ||
      activeModification._id !== modification._id ||
      mapState.state !== MAP_STATE_HIGHLIGHT_SEGMENT
      ? -1
      : mapState.segmentIndex
  }

  getHighlightStopForModification (modification: Modification): Stop | null {
    const {activeModification, mapState, qualifiedStops} = this.props
    return !activeModification ||
      activeModification._id !== modification._id ||
      mapState.state !== MAP_STATE_HIGHLIGHT_STOP
      ? null
      : qualifiedStops[mapState.stopIndex]
  }

  _selectStops = (selectedStops: string[]) => {
    const p = this.props
    if (p.activeModification) {
      switch (p.mapState.action) {
        case 'add':
          p.updateLocally({
            stops: [...new Set([...p.activeModification.stops, ...selectedStops])]
          })
          break
        case 'new':
          p.updateLocally({stops: selectedStops})
          break
        case 'remove':
          p.updateLocally({
            stops: p.activeModification.stops.filter(
              sid => selectedStops.indexOf(sid) === -1
            )
          })
          break
      }
    }
    p.setMapState({
      modification: null,
      state: null
    })
  }

  _selectHops = (hops: string[][]) => {
    const p = this.props
    if (p.activeModification) {
      switch (p.mapState.action) {
        case 'add':
          p.updateLocally({
            hops: [...new Set([...p.activeModification.hops, ...hops])]
          })
          break
        case 'new':
          p.updateLocally({hops})
          break
        case 'remove':
          p.updateLocally({
            hops: p.activeModification.hops.filter(
              existing =>
                hops.findIndex(
                  selected =>
                    existing[0] === selected[0] && existing[1] === selected[1]
                ) === -1
            )
          })
          break
      }
    }
    p.setMapState({
      modification: null,
      state: null
    })
  }

  renderStateSpecificLayers () {
    const p = this.props
    if (!p.activeModification) return
    switch (p.mapState.state) {
      case MAP_STATE_STOP_SELECTION:
        return (
          <StopSelectPolygon
            routeStops={p.mapState.routeStops}
            selectStops={this._selectStops}
          />
        )
      case MAP_STATE_HOP_SELECTION:
        return (
          <HopSelectPolygon
            feeds={p.feeds}
            hopStops={getHopStopsForModification({
              feed: p.activeModificationFeed,
              modification: p.activeModification
            })}
            selectHops={this._selectHops}
          />
        )
      case MAP_STATE_TRANSIT_EDITOR:
        return (
          <TransitEditor
            allowExtend={p.mapState.allowExtend}
            extendFromEnd={p.mapState.extendFromEnd}
            feeds={p.feeds}
            followRoad={!!p.mapState.followRoad}
            modification={p.activeModification}
            spacing={p.mapState.spacing}
            updateModification={p.updateLocally}
          />
        )
      case MAP_STATE_SELECT_FROM_STOP:
      case MAP_STATE_SELECT_TO_STOP:
        return (
          <StopLayer
            feed={p.activeModificationFeed}
            modification={p.activeModification}
            nullIsWildcard
            onSelect={stop => {
              p.updateLocally(updateAddStopsTerminus({
                feed: p.activeModificationFeed,
                modification: p.activeModification,
                newStop: stop,
                which: p.mapState.state === MAP_STATE_SELECT_FROM_STOP
                  ? 'fromStop'
                  : 'toStop'
              }))
              p.setMapState({state: null})
            }}
            selectedColor={colors.ACTIVE}
          />
        )
    }
  }
}

// TODO: Move to selector
function getHopStopsForModification ({
  feed,
  modification
}: {
  feed: any,
  modification: any
}) {
  // get all hops from all (selected) patterns
  const route = feed.routes.find(r => r.route_id === modification.routes[0])
  if (!route) return []
  let patterns = route.patterns

  if (modification.trips !== null) {
    patterns = patterns.filter(
      pat =>
        pat.trips.findIndex(t => modification.trips.indexOf(t.trip_id) > -1) >
        -1
    )
  }

  const hopsForPattern = patterns.map(p =>
    p.stops.map(
      (stop, index, array) =>
        (index < array.length - 1
          ? [stop.stop_id, array[index + 1].stop_id]
          : null)
    )
  )

  // smoosh hops from all patterns together
  const candidateHops = [].concat(...hopsForPattern).filter(hop => hop != null)

  return candidateHops.map(hop => [
    feed.stopsById[hop[0]],
    feed.stopsById[hop[1]]
  ])
}
