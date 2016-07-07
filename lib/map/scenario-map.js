/** A map component showing a scenario */

import React, {Component, PropTypes} from 'react'
import {FeatureGroup, Map as LeafletMap, TileLayer} from 'react-leaflet'
import {connect} from 'react-redux'

import {setMapState} from '../actions'
import {updateStop as updateAddStopsTerminus} from '../add-stops'
import AddStopsLayer from './add-stops-layer'
import AddTripPatternLayer from './add-trip-pattern-layer'
import colors from '../colors'
import HopLayer from './hop-layer'
import HopSelectPolygon from './hop-select-polygon'
import PatternLayer from './pattern-layer'
import StopLayer from './stop-layer'
import StopSelectPolygon from './stop-select-polygon'
import TransitEditor from './transit-editor/index'

// prefer to use canvas for rendering, improves speed significantly
// http://leafletjs.com/reference.html#global
// with this on we might be able to get rid of the stop layer
window.L_PREFER_CANVAS = true

function mapStateToProps (state) {
  const {currentBundle} = state.scenario
  return {
    activeModification: state.scenario.activeModification,
    centerLatlng: currentBundle ? {lng: currentBundle.centerLon, lat: currentBundle.centerLat} : null,
    feeds: state.scenario.feeds,
    feedsById: state.scenario.feedsById,
    mapState: state.mapState,
    modifications: state.scenario.modifications,
    modificationsById: state.scenario.modificationsById,
    projectIsReady: !!(currentBundle && state.scenario.currentProject)
  }
}

const mapDispatchToProps = {setMapState}

class ScenarioMap extends Component {
  static propTypes = {
    activeModification: PropTypes.object,
    centerLatlng: PropTypes.shape({
      lng: PropTypes.number,
      lat: PropTypes.number
    }),
    feeds: PropTypes.array.isRequired,
    feedsById: PropTypes.object.isRequired,
    mapState: PropTypes.object,
    modifications: PropTypes.array.isRequired,
    modificationsById: PropTypes.object.isRequired,
    projectIsReady: PropTypes.bool.isRequired,
    replaceModification: PropTypes.func,
    setMapState: PropTypes.func
  }

  render () {
    const {centerLatlng, projectIsReady} = this.props
    // default location: Washington, DC because that's where @mattwigway lives
    const center = centerLatlng || {lat: 38.8886, lng: -77.0430}

    return <LeafletMap
      center={center}
      zoom={12}
      >
      <TileLayer
        url='https://{s}.tiles.mapbox.com/v3/conveyal.hml987j0/{z}/{x}/{y}.png'
        attribution='Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://mapbox.com">Mapbox</a>'
        />

      {projectIsReady && this.renderModifications()}
    </LeafletMap>
  }

  renderModifications () {
    const {activeModification, feedsById, mapState, modifications} = this.props
    // default location: Washington, DC because that's where @mattwigway lives
    const modificationsOnMap = modifications.filter((m) => m.showOnMap)
    const dim = (id) => activeModification && activeModification.id !== id
    return <FeatureGroup>
      {/* show patterns at the bottom */}
      {modificationsOnMap
        .filter((m) => m.type === 'remove-trips')
        .map((m) => <PatternLayer
          color={colors.REMOVED}
          dim={dim(m.id)}
          feed={feedsById[m.feed]}
          key={m.id}
          modification={m}
          />
        )}

      {modificationsOnMap
        .filter((m) => m.type === 'convert-to-frequency')
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
        .filter((m) => m.type === 'remove-stops' || m.type === 'add-stops' || m.type === 'adjust-dwell-time')
        .map((m) => <PatternLayer
          color={colors.NEUTRAL}
          dim={dim(m.id)}
          feed={feedsById[m.feed]}
          key={m.id}
          modification={m}
          />
        )}

      {modificationsOnMap
        .filter((m) => m.type === 'adjust-speed')
        // show the full pattern in neutral gray, selection in purple
        .map((m) => {
          if (m.hops) {
            return (
              <FeatureGroup>
                <PatternLayer
                  color={colors.NEUTRAL}
                  dim={dim(m.id)}
                  feed={feedsById[m.feed]}
                  key={m.id + 'full'}
                  modification={m}
                  />
                <HopLayer
                  color={colors.MODIFIED}
                  feed={feedsById[m.feed]}
                  dim={dim(m.id)}
                  key={m.id + 'segment'}
                  modification={m}
                  />
              </FeatureGroup>
            )
          } else {
            (
              <FeatureGroup>
                <PatternLayer
                  color={colors.NEUTRAL}
                  dim={dim(m.id)}
                  feed={feedsById[m.feed]}
                  key={m.id + 'full'}
                  modification={m}
                  />
                <PatternLayer
                  color={colors.MODIFIED}
                  feed={feedsById[m.feed]}
                  dim={dim(m.id)}
                  key={m.id + 'segment'}
                  modification={m}
                  />
              </FeatureGroup>
            )
          }
        })
      }

      {/* removed stops in red */}
      {modificationsOnMap
        .filter((m) => m.type === 'remove-stops')
        .map((m) => <StopLayer
          dim={dim(m.id)}
          feed={feedsById[m.feed]}
          key={m.id}
          modification={m}
          nullIsWildcard={false}
          selectedColor={colors.REMOVED}
          />
        )}

      {/* adjusted dwell times in purple */}
      {modificationsOnMap
        .filter((m) => m.type === 'adjust-dwell-time')
        .map((m) => <StopLayer
          dim={dim(m.id)}
          feed={feedsById[m.feed]}
          key={m.id}
          modification={m}
          nullIsWildcard
          selectedColor={colors.MODIFIED}
          />
        )}

      {modificationsOnMap
        .filter((m) => m.type === 'add-stops' && (mapState.modificationId == null || mapState.modificationId !== m.id))
        .map((m) => <AddStopsLayer
          feed={feedsById[m.feed]}
          key={`add-stops-layer-${m.id}`}
          modification={m}
          />
        )}

      {/* Added trip patterns. */}
      {modificationsOnMap
        // hide trip pattern currently being edited
        .filter((m) => m.type === 'add-trip-pattern' && (mapState.modificationId === undefined || mapState.modificationId !== m.id))
        // if there's only a single stop, don't render
        .filter((m) => m.segments.length > 0 && m.segments[0].geometry.type !== 'Point')
        .map((m) => <AddTripPatternLayer
          key={`add-trip-pattern-layer-${m.id}`}
          modification={m} />
        )}

      {/* state-specific layers */}
      {this.renderStateSpecificLayers()}
    </FeatureGroup>
  }

  renderStateSpecificLayers () {
    const {feedsById, mapState, replaceModification, setMapState} = this.props
    if (mapState.state === 'stop-selection') {
      return <StopSelectPolygon
        action={mapState.action}
        modification={mapState.modification}
        replaceModification={replaceModification}
        routeStops={mapState.routeStops}
        setMapState={setMapState}
        />
    } else if (mapState.state === 'hop-selection') {
      return <HopSelectPolygon
        action={mapState.action}
        feed={feedsById[mapState.modification.feed]}
        modification={mapState.modification}
        replaceModification={replaceModification}
        setMapState={setMapState}
        />
    } else if (mapState.state === 'add-trip-pattern' || mapState.state === 'add-stops') {
      const m = this.props.modificationsById[mapState.modificationId]
      return <TransitEditor
        {...mapState}
        allowExtend={mapState.allowExtend}
        extendFromEnd={mapState.extendFromEnd}
        followRoad={mapState.followRoad}
        modification={m}
        replaceModification={replaceModification}
        />
    } else if (mapState.state === 'single-stop-selection') {
      const m = mapState.modification
      return <StopLayer
        allowSelect
        key={m.id + '_select'}
        modification={m}
        nullIsWildcard
        onSelect={(stop) => {
          replaceModification(updateAddStopsTerminus({modification: m, which: mapState.which, newStop: stop, feed: feedsById[m.feed]}))
          setMapState({})
        }}
        selectedColor={colors.ACTIVE}
        />
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(ScenarioMap)
