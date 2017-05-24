// @flow
import React, {Component} from 'react'
import {FeatureGroup} from 'react-leaflet'

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
import AddTripPatternLayer from './add-trip-pattern-layer'
import AdjustSpeedLayer from './adjust-speed-layer'
import HopSelectPolygon from './hop-select-polygon'
import PatternLayer from './pattern-layer'
import PatternStopsLayer from './pattern-stops-layer'
import RerouteLayer from './reroute-layer'
import StopLayer from './stop-layer'
import StopSelectPolygon from './stop-select-polygon'
import TransitEditor from './transit-editor'

import type {Feed, LonLat, MapState, Modification, Stop} from '../../types'

type Props = {
  activeModification?: Modification,
  activeModificationFeed?: Feed,
  bundleId: string,
  centerLonLat: LonLat,
  feeds: Feed[],
  feedsById: {
    [feedId: string]: Feed
  },
  mapState: MapState,
  modificationsOnMap: Modification[],
  qualifiedStops: Stop[],
  replaceModification: (options: {bundleId: string, modification: Modification}) => void,
  setMapState: (MapState) => void
}

/**
 * A map component showing a scenario
 */
export default class ScenarioMap extends Component<any, Props, any> {
  updateModification = (properties: Modification) => {
    const {activeModification, bundleId, replaceModification} = this.props
    replaceModification({
      bundleId,
      modification: {
        ...activeModification,
        ...properties
      }
    })
  }

  render () {
    const {activeModification, feedsById, mapState, modificationsOnMap} = this.props
    // Add trip pattern modifications do not have a feed property but should still be shown on the map.
    const dim = (id) => activeModification && activeModification.id !== id

    return <FeatureGroup>
      {/* show patterns at the bottom */}
      {modificationsOnMap
        .filter((m) => m.type === REMOVE_TRIPS)
        .map((m) => <PatternLayer
          color={colors.REMOVED}
          dim={dim(m.id)}
          feed={feedsById[m.feed]}
          key={m.id}
          modification={m}
          />
        )}

      {modificationsOnMap
        .filter((m) => m.type === CONVERT_TO_FREQUENCY)
        .map((m) => <PatternLayer
          activeTrips={mapState.activeTrips}
          activeModification={activeModification}
          color={colors.MODIFIED}
          dim={dim(m.id)}
          feed={feedsById[m.feed]}
          key={m.id}
          modification={m}
          />
        )}

      {/* show patterns with added or removed stop in neutral gray, the stops/reroutes themselves will be shown as red or blue depending on whether they are removed or added. */}
      {modificationsOnMap
        .filter((m) => m.type === REMOVE_STOPS || m.type === ADJUST_DWELL_TIME)
        .map((m) => <PatternStopsLayer
          selectedStopColor={m.type === REMOVE_STOPS ? colors.REMOVED : colors.MODIFIED}
          dim={dim(m.id)}
          nullIsWildcard={m.type === ADJUST_DWELL_TIME}
          feed={feedsById[m.feed]}
          key={m.id}
          modification={m}
          />
        )}

      {modificationsOnMap
        .filter((m) => m.type === ADJUST_SPEED)
        .map((m) => <AdjustSpeedLayer
          key={`adjust-speed-${m.id}`}
          dim={dim(m.id)}
          feed={feedsById[m.feed]}
          modification={m}
          />
        )}
      }

      {modificationsOnMap
        .filter((m) => (m.type === REROUTE))
        .map((m) => <RerouteLayer
          dim={dim(m.id)}
          feed={feedsById[m.feed]}
          highlightSegment={this.getHighlightSegmentForModification(m)}
          highlightStop={this.getHighlightStopForModification(m)}
          key={`reroute-layer-${m.id}`}
          modification={m}
          showAddedSegment={mapState.state !== MAP_STATE_TRANSIT_EDITOR ||
            !activeModification ||
            activeModification.id !== m.id}
          />
        )}

      {/* Added trip patterns. */}
      {modificationsOnMap
        .filter(({type}) => type === ADD_TRIP_PATTERN)
        // hide trip pattern currently being edited
        .filter(({id}) => !activeModification || id !== activeModification.id || mapState.state !== MAP_STATE_TRANSIT_EDITOR)
        // if there's only a single stop, don't render
        .filter(({segments}) => segments.length > 0 && segments[0].geometry.type !== 'Point')
        .map((m) => <AddTripPatternLayer
          key={`add-trip-pattern-layer-${m.id}`}
          bidirectional={m.bidirectional}
          highlightSegment={this.getHighlightSegmentForModification(m)}
          highlightStop={this.getHighlightStopForModification(m)}
          segments={m.segments} />
        )}

      {/* state-specific layers */}
      {this.renderStateSpecificLayers()}
    </FeatureGroup>
  }

  getHighlightSegmentForModification (modification: Modification): number {
    const {activeModification, mapState} = this.props
    return !activeModification ||
      activeModification.id !== modification.id ||
      mapState.state !== MAP_STATE_HIGHLIGHT_SEGMENT
      ? -1
      : mapState.segmentIndex
  }

  getHighlightStopForModification (modification: Modification): Stop | null {
    const {activeModification, mapState, qualifiedStops} = this.props
    return !activeModification ||
      activeModification.id !== modification.id ||
      mapState.state !== MAP_STATE_HIGHLIGHT_STOP
      ? null
      : qualifiedStops[mapState.stopIndex]
  }

  renderStateSpecificLayers () {
    const {
      activeModification,
      activeModificationFeed,
      bundleId,
      feeds,
      mapState,
      replaceModification,
      setMapState
    } = this.props
    if (!activeModification) return <g />
    switch (mapState.state) {
      case MAP_STATE_STOP_SELECTION:
        return <StopSelectPolygon
          action={mapState.action}
          modification={activeModification}
          replaceModification={(modification) => replaceModification({bundleId, modification})}
          routeStops={mapState.routeStops}
          setMapState={setMapState}
          />
      case MAP_STATE_HOP_SELECTION:
        return <HopSelectPolygon
          action={mapState.action}
          bundleId={bundleId}
          feed={activeModificationFeed}
          modification={activeModification}
          replaceModification={(modification) => replaceModification({bundleId, modification})}
          setMapState={setMapState}
          />
      case MAP_STATE_TRANSIT_EDITOR:
        return <TransitEditor
          {...mapState}
          allowExtend={mapState.allowExtend}
          extendFromEnd={mapState.extendFromEnd}
          feeds={feeds}
          followRoad={!!mapState.followRoad}
          modification={activeModification}
          spacing={mapState.spacing}
          updateModification={this.updateModification}
          />
      case MAP_STATE_SELECT_FROM_STOP:
      case MAP_STATE_SELECT_TO_STOP:
        return <StopLayer
          feed={activeModificationFeed}
          modification={activeModification}
          nullIsWildcard
          onSelect={(stop) => {
            replaceModification({
              bundleId,
              modification: updateAddStopsTerminus({
                feed: activeModificationFeed,
                modification: activeModification,
                newStop: stop,
                which: mapState.state === MAP_STATE_SELECT_FROM_STOP ? 'fromStop' : 'toStop'
              })
            })
            setMapState({
              state: null,
              modification: null
            })
          }}
          selectedColor={colors.ACTIVE}
          />
    }
  }
}
