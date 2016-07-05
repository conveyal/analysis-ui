/** A map component showing a scenario */

import React, { Component, PropTypes } from 'react'
import {connect} from 'react-redux'
import {setMapState} from '../actions'

import { Map as LeafletMap, TileLayer, FeatureGroup } from 'react-leaflet'
import AddTripPatternLayer from './add-trip-pattern-layer'
import StopSelectPolygon from './stop-select-polygon'
import PatternLayer from './pattern-layer'
import StopLayer from './stop-layer'
import HopLayer from './hop-layer'
import AddStopsLayer from './add-stops-layer'
import HopSelectPolygon from './hop-select-polygon'

import TransitEditor from './transit-editor/index'
import { updateStop as updateAddStopsTerminus } from '../add-stops'
import colors from '../colors'

// prefer to use canvas for rendering, improves speed significantly
// http://leafletjs.com/reference.html#global
// with this on we might be able to get rid of the stop layer
window.L_PREFER_CANVAS = true

function mapStateToProps (state) {
  return {
    activeModification: state.scenario.activeModification,
    centerLatlng: state.scenario.bundle ? {lng: state.scenario.centerLon, lat: state.scenario.centerLat} : null,
    data: state.scenario.data,
    feeds: state.scenario.data.feeds,
    mapState: state.mapState,
    modifications: state.scenario.modifications
  }
}

const mapDispatchToProps = {setMapState}

class ScenarioMap extends Component {
  static propTypes = {
    activeModification: PropTypes.object,
    bundle: PropTypes.shape({
      centerLat: PropTypes.number,
      centerLon: PropTypes.number
    }),
    data: PropTypes.object,
    feeds: PropTypes.object,
    mapState: PropTypes.object,
    modifications: PropTypes.object,
    replaceModification: PropTypes.func,
    setMapState: PropTypes.func
  }

  /** don't update when something stateful (e.g. editing geometry, doing a polygon select) is happening on the map */
  /* shouldComponentUpdate (nextProps) {
    // if the map state is identical (has the same memory address is sufficient, state is immutable)
    // and the state is not null (implying something is happening on the map), don't update
    return this.props.mapState.state == null || this.props.mapState !== nextProps.mapState
  } */

  render () {
    const {activeModification, centerLatlng, data, feeds, mapState, modifications} = this.props
    // default location: Washington, DC because that's where @mattwigway lives
    const center = centerLatlng || {lat: 38.8886, lng: -77.0430}
    const modificationsOnMap = (modifications ? [...modifications.values()] : []).filter((m) => m.showOnMap)
    const dim = (id) => activeModification && activeModification.id !== id

    return <LeafletMap
      center={center}
      zoom={12}
      >
      <TileLayer
        url='https://{s}.tiles.mapbox.com/v3/conveyal.hml987j0/{z}/{x}/{y}.png'
        attribution='Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://mapbox.com">Mapbox</a>'
        />

      {/* show patterns at the bottom */}
      {modificationsOnMap
        .filter((m) => m.type === 'remove-trips')
        .map((m) => <PatternLayer
          color={colors.REMOVED}
          dim={dim(m.id)}
          feeds={feeds}
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
          feeds={feeds}
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
          feeds={feeds}
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
                  feeds={feeds}
                  key={m.id + 'full'}
                  modification={m}
                  />
                <HopLayer
                  color={colors.MODIFIED}
                  feeds={feeds}
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
                  feeds={feeds}
                  key={m.id + 'full'}
                  modification={m}
                  />
                <PatternLayer
                  color={colors.MODIFIED}
                  feeds={feeds}
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
          data={this.props.data}
          dim={dim(m.id)}
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
          data={data}
          dim={dim(m.id)}
          key={m.id}
          modification={m}
          nullIsWildcard
          selectedColor={colors.MODIFIED}
          />
        )}

      {modificationsOnMap
        .filter((m) => m.type === 'add-stops' && (mapState.modificationId == null || mapState.modificationId !== m.id))
        .map((m) => <AddStopsLayer
          feeds={feeds}
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
          data={data}
          key={`add-trip-pattern-layer-${m.id}`}
          modification={m} />
        )}

      {/* state-specific layers */}
      {this.renderStateSpecificLayers()}
    </LeafletMap>
  }

  renderStateSpecificLayers () {
    const {data, mapState, replaceModification, setMapState} = this.props
    if (mapState.state === 'stop-selection') {
      return <StopSelectPolygon replaceModification={replaceModification} setMapState={setMapState} {...mapState} />
    } else if (mapState.state === 'hop-selection') {
      return <HopSelectPolygon replaceModification={replaceModification} setMapState={setMapState} data={data} {...mapState} />
    } else if (mapState.state === 'add-trip-pattern' || mapState.state === 'add-stops') {
      const m = this.props.modifications.get(mapState.modificationId)
      return <TransitEditor
        {...mapState}
        data={data}
        modification={m}
        replaceModification={replaceModification}
        />
    } else if (mapState.state === 'single-stop-selection') {
      const m = mapState.modification
      return <StopLayer
        allowSelect
        data={data}
        key={m.id + '_select'}
        modification={m}
        nullIsWildcard
        onSelect={(stop) => {
          this.props.replaceModification(updateAddStopsTerminus(m, mapState.which, stop, data))
          this.props.setMapState({})
        }}
        selectedColor={colors.ACTIVE}
        />
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(ScenarioMap)
