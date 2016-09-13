/** A map component showing a scenario */

import React, {Component, PropTypes} from 'react'
import {FeatureGroup} from 'react-leaflet'
import {connect} from 'react-redux'

import {setMapState} from '../actions'
import {setAndRetrieveData as replaceModification} from '../actions/modifications'
import updateAddStopsTerminus from '../utils/update-add-stops-terminus'
import AddTripPatternLayer from './add-trip-pattern-layer'
import colors from '../utils/colors'
import AdjustSpeedLayer from './adjust-speed-layer'
import HopSelectPolygon from './hop-select-polygon'
import * as modType from '../utils/modification-types'
import PatternLayer from './pattern-layer'
import PatternStopsLayer from './pattern-stops-layer'
import RerouteLayer from './reroute-layer'
import * as mapStateType from './state'
import StopLayer from './stop-layer'
import StopSelectPolygon from './stop-select-polygon'
import TransitEditor from './transit-editor/index'

function mapStateToProps (state, props) {
  const {currentBundle, currentScenario, feeds} = state.scenario
  return {
    bundleId: currentBundle && currentBundle.id,
    centerLatlng: currentBundle ? {lng: currentBundle.centerLon, lat: currentBundle.centerLat} : null,
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
    centerLatlng: PropTypes.shape({
      lng: PropTypes.number,
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
    const modificationsOnMap = modifications.filter((m) => m.showOnMap && (m.feed || m.type === modType.ADD_TRIP_PATTERN))
    const dim = (id) => activeModification && activeModification.id !== id

    return <FeatureGroup>
      {/* show patterns at the bottom */}
      {modificationsOnMap
        .filter((m) => m.type === modType.REMOVE_TRIPS)
        .map((m) => <PatternLayer
          color={colors.REMOVED}
          dim={dim(m.id)}
          feed={feedsById[m.feed]}
          key={m.id}
          modification={m}
          />
        )}

      {modificationsOnMap
        .filter((m) => m.type === modType.CONVERT_TO_FREQUENCY)
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

      {/* show patterns with added or removed stop in neutral gray, the stops/reroutes themselves will be shown as red or blue depending on whether they are removed or added.*/}
      {modificationsOnMap
        .filter((m) => m.type === modType.REMOVE_STOPS || m.type === modType.ADJUST_DWELL_TIME)
        .map((m) => <PatternStopsLayer
          selectedStopColor={m.type === modType.REMOVE_STOPS ? colors.REMOVED : colors.MODIFIED}
          dim={dim(m.id)}
          nullIsWildcard={m.type === modType.ADJUST_DWELL_TIME}
          feed={feedsById[m.feed]}
          key={m.id}
          modification={m}
          />
        )}

      {modificationsOnMap
        .filter((m) => m.type === modType.ADJUST_SPEED)
        .map((m) => <AdjustSpeedLayer
          key={`adjust-speed-${m.id}`}
          dim={dim(m.id)}
          feed={feedsById[m.feed]}
          modification={m}
          />
        )}
      }

      {modificationsOnMap
        .filter((m) => (m.type === modType.REROUTE))
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
        .filter((m) => m.type === modType.ADD_TRIP_PATTERN && (mapState.modificationId === undefined || mapState.modificationId !== m.id))
        // if there's only a single stop, don't render
        .filter((m) => m.segments.length > 0 && m.segments[0].geometry.type !== 'Point')
        .map((m) => <AddTripPatternLayer
          key={`add-trip-pattern-layer-${m.id}`}
          segments={m.segments} />
        )}

      {/* state-specific layers */}
      {this.renderStateSpecificLayers()}
    </FeatureGroup>
  }

  renderStateSpecificLayers () {
    const {bundleId, feeds, feedsById, mapState, modificationsById, replaceModification, setMapState} = this.props
    switch (mapState.state) {
      case mapStateType.STOP_SELECTION:
        return <StopSelectPolygon
          action={mapState.action}
          modification={mapState.modification}
          replaceModification={(modification) => replaceModification({bundleId, modification})}
          routeStops={mapState.routeStops}
          setMapState={setMapState}
          />
      case mapStateType.HOP_SELECTION:
        return <HopSelectPolygon
          action={mapState.action}
          bundleId={bundleId}
          feed={feedsById[mapState.modification.feed]}
          modification={mapState.modification}
          replaceModification={(modification) => replaceModification({bundleId, modification})}
          setMapState={setMapState}
          />
      case mapStateType.ADD_STOPS:
      case mapStateType.ADD_TRIP_PATTERN:
        const m = modificationsById[mapState.modificationId]
        if (m) {
          return <TransitEditor
            {...mapState}
            allowExtend={mapState.allowExtend}
            extendFromEnd={mapState.extendFromEnd}
            feeds={feeds}
            followRoad={!!mapState.followRoad}
            modification={m}
            replaceModification={(modification) => replaceModification({ bundleId, modification })}
            />
        } else {
          break
        }
      case mapStateType.SINGLE_STOP_SELECTION:
        const {modification} = mapState
        const feed = feedsById[modification.feed]
        return <StopLayer
          feed={feed}
          modification={modification}
          nullIsWildcard
          onSelect={(stop) => {
            replaceModification({
              bundleId,
              modification: updateAddStopsTerminus({modification, which: mapState.which, newStop: stop, feed})
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
