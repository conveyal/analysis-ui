/** A map component showing a scenario */

import React, {Component, PropTypes} from 'react'
import {FeatureGroup} from 'react-leaflet'
import {connect} from 'react-redux'

import {
  ADD_TRIP_PATTERN,
  ADJUST_DWELL_TIME,
  ADJUST_SPEED,
  CONVERT_TO_FREQUENCY,
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

import {setMapState} from '../../actions/map'
import {setAndRetrieveData as replaceModification} from '../../actions/modifications'
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

function mapStateToProps (state, props) {
  const {currentBundle, currentScenario, feeds} = state.scenario
  return {
    bundleId: currentBundle && currentBundle.id,
    centerLonLat: currentBundle ? {lon: currentBundle.centerLon, lat: currentBundle.centerLat} : null,
    feeds,
    feedsById: state.scenario.feedsById,
    mapState: state.mapState,
    modifications: state.scenario.modifications,
    modificationsById: state.scenario.modificationsById,
    scenarioIsReady: !!(currentBundle && currentScenario && feeds && feeds.length > 0)
  }
}

const mapDispatchToProps = {replaceModification, setMapState}

class ScenarioMap extends Component {
  static propTypes = {
    activeModification: PropTypes.object,
    bundleId: PropTypes.string,
    centerLonLat: PropTypes.shape({
      lon: PropTypes.number,
      lat: PropTypes.number
    }),
    feeds: PropTypes.array.isRequired,
    feedsById: PropTypes.object.isRequired,
    mapState: PropTypes.object,
    modifications: PropTypes.array.isRequired,
    modificationsById: PropTypes.object.isRequired,
    scenarioIsReady: PropTypes.bool.isRequired,
    replaceModification: PropTypes.func.isRequired,
    setMapState: PropTypes.func.isRequired
  }

  updateModification = (properties) => {
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
    const {scenarioIsReady} = this.props
    if (scenarioIsReady) return this.renderModifications()
    else return <g />
  }

  renderModifications () {
    const {activeModification, feedsById, mapState, modifications} = this.props
    // Add trip pattern modifications do not have a feed property but should still be shown on the map.
    const modificationsOnMap = modifications.filter((m) => m.showOnMap && (m.feed || m.type === ADD_TRIP_PATTERN))
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
          feed={feedsById[m.feed]}
          key={`reroute-layer-${m.id}`}
          modification={m}
          showAddedSegment={mapState.modificationId !== m.id}
          />
        )}

      {/* Added trip patterns. */}
      {modificationsOnMap
        // hide trip pattern currently being edited
        .filter((m) => m.type === ADD_TRIP_PATTERN && (mapState.modificationId === undefined || mapState.modificationId !== m.id))
        // if there's only a single stop, don't render
        .filter((m) => m.segments.length > 0 && m.segments[0].geometry.type !== 'Point')
        .map((m) => <AddTripPatternLayer
          key={`add-trip-pattern-layer-${m.id}`}
          bidirectional={m.bidirectional}
          segments={m.segments} />
        )}

      {/* state-specific layers */}
      {this.renderStateSpecificLayers()}
    </FeatureGroup>
  }

  renderStateSpecificLayers () {
    const {bundleId, feeds, feedsById, mapState, modificationsById, replaceModification, setMapState} = this.props
    switch (mapState.state) {
      case MAP_STATE_STOP_SELECTION:
        return <StopSelectPolygon
          action={mapState.action}
          modification={mapState.modification}
          replaceModification={(modification) => replaceModification({bundleId, modification})}
          routeStops={mapState.routeStops}
          setMapState={setMapState}
          />
      case MAP_STATE_HOP_SELECTION:
        return <HopSelectPolygon
          action={mapState.action}
          bundleId={bundleId}
          feed={feedsById[mapState.modification.feed]}
          modification={mapState.modification}
          replaceModification={(modification) => replaceModification({bundleId, modification})}
          setMapState={setMapState}
          />
      case MAP_STATE_TRANSIT_EDITOR:
        const m = modificationsById[mapState.modificationId]
        if (m) {
          return <TransitEditor
            {...mapState}
            allowExtend={mapState.allowExtend}
            extendFromEnd={mapState.extendFromEnd}
            feeds={feeds}
            followRoad={!!mapState.followRoad}
            modification={m}
            spacing={mapState.spacing}
            updateModification={(properties) => replaceModification({
              bundleId,
              modification: {
                ...m,
                ...properties
              }
            })}
            />
        } else {
          break
        }
      case MAP_STATE_SELECT_FROM_STOP:
      case MAP_STATE_SELECT_TO_STOP:
        const {modification} = mapState
        const feed = feedsById[modification.feed]
        return <StopLayer
          feed={feed}
          modification={modification}
          nullIsWildcard
          onSelect={(stop) => {
            replaceModification({
              bundleId,
              modification: updateAddStopsTerminus({
                feed,
                modification,
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

export default connect(mapStateToProps, mapDispatchToProps)(ScenarioMap)
