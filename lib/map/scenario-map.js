/** A map component showing a scenario */

import React, { Component, PropTypes } from 'react'
import { Map as LeafletMap, TileLayer, GeoJson } from 'react-leaflet'
import LeafletTransitEditor from 'leaflet-transit-editor'
import StopSelectPolygon from './stop-select-polygon'
import PatternLayer from './pattern-layer'
import StopLayer from './stop-layer'
import HopLayer from './hop-layer'
import AddStopsLayer from './add-stops-layer'
import HopSelectPolygon from './hop-select-polygon'
import AddTripPatternLayer from './add-trip-pattern-layer'
import AddTripPatternControl from './add-trip-pattern-control'
import { updateStop as updateAddStopsTerminus } from '../add-stops'
import colors from '../colors'

export default class ScenarioMap extends Component {
  static propTypes = {
    bundle: PropTypes.shape({
      centerLat: PropTypes.number,
      centerLon: PropTypes.number
    }),
    data: PropTypes.object,
    mapState: PropTypes.object,
    modifications: PropTypes.object,
    replaceModification: PropTypes.func,
    setMapState: PropTypes.func
  }

  render () {
    const {bundle, data, mapState, modifications} = this.props
    // default location: Washington, DC because that's where @mattwigway lives
    const center = bundle ? [bundle.centerLat, bundle.centerLon] : [38.8886, -77.0430]
    const modificationsOnMap = (modifications ? [...modifications.values()] : []).filter((m) => m.showOnMap)
    const focusedId = mapState.modification
      ? mapState.modification.id
      : false

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
          dim={focusedId && focusedId !== m.id}
          data={data}
          key={m.id}
          modification={m}
          />
        )}

      {modificationsOnMap
        .filter((m) => m.type === 'convert-to-frequency')
        .map((m) => <PatternLayer
          color={colors.MODIFIED}
          data={data}
          dim={focusedId && focusedId !== m.id}
          key={m.id}
          modification={m}
          />
        )}

      {/* show patterns with added or removed stop in neutral gray, the stops/reroutes themselves will be shown as red or blue depending on whether they are removed or added.*/}
      {modificationsOnMap
        .filter((m) => m.type === 'remove-stops' || m.type === 'add-stops' || m.type === 'adjust-dwell-time')
        .map((m) => <PatternLayer
          color={colors.NEUTRAL}
          data={data}
          dim={focusedId && focusedId !== m.id}
          key={m.id}
          modification={m}
          />
        )}

      {modificationsOnMap
        .filter((m) => m.type === 'adjust-speed')
        // show the full pattern in neutral gray, selection in purple
        .map((m) => [
          <PatternLayer
            color={colors.NEUTRAL}
            data={data}
            dim={focusedId && focusedId !== m.id}
            key={m.id + 'full'}
            modification={m}
            />,
          <HopLayer
            color={colors.MODIFIED}
            data={data}
            dim={focusedId && focusedId !== m.id}
            key={m.id + 'segment'}
            modification={m}
            />
        ])}

      {/* removed stops in red */}
      {modificationsOnMap
        .filter((m) => m.type === 'remove-stops')
        .map((m) => <StopLayer
          data={this.props.data}
          dim={focusedId && focusedId !== m.id}
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
          dim={focusedId && focusedId !== m.id}
          key={m.id}
          modification={m}
          nullIsWildcard
          selectedColor={colors.MODIFIED}
          />
        )}

      {modificationsOnMap
        .filter((m) => m.type === 'add-stops' && (mapState.modification == null || mapState.modification.id !== m.id))
        .map((m) => <AddStopsLayer
          data={data}
          key={`add-stops-layer-${m.id}`}
          modification={m}
          />
        )}

      {/* Added trip patterns. */}
      {modificationsOnMap
        // hide trip pattern currently being edited
        .filter((m) => m.type === 'add-trip-pattern' && (mapState.modification === undefined || mapState.modification.id !== m.id))
        // NB: updating the props of a geojson layer does nothing, but we won't ever do that as the only time geometries change is when the modification has been updated and we will have removed that modification from the map
        .map((m) => <GeoJson
          color={colors.ADDED}
          data={{
            type: 'Feature',
            properties: {},
            geometry: m.geometry
          }}
          key={m.id}
          weight={3}
          />
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
      const { stops, stopIds, geometry, controlPoints } = mapState.modification
      const snapStops = [].concat(...[...data.feeds.values()]
        .map((v) => [...v.stops.values()]
          // feed-id-scope stops so that we can snap new patterns to stops from multiple feeds
          .map((gtfsStop) => {
            return {
              stop_id: `${v.feed_id}:${gtfsStop.stop_id}`,
              stop_lat: gtfsStop.stop_lat,
              stop_lon: gtfsStop.stop_lon
            } })
          )
        )

      // if it's a reroute you can only extend from the end if there's no to stop
      const allowExtendFromEnd = mapState.state === 'add-trip-pattern' || mapState.modification.toStop === null
      const allowExtendFromStart = mapState.state === 'add-trip-pattern' || mapState.modification.fromStop === null

      const leafletTransitEditor = new LeafletTransitEditor({ stops, stopIds, geometry, controlPoints, snapStops, allowExtendFromStart, allowExtendFromEnd })

      return [
        <AddTripPatternLayer
          leafletTransitEditor={leafletTransitEditor}
          />,
        <AddTripPatternControl
          leafletTransitEditor={leafletTransitEditor}
          modification={mapState.modification}
          replaceModification={this.props.replaceModification}
          setMapState={this.props.setMapState}
          />
      ]
    } else if (mapState.state === 'single-stop-selection') {
      const m = mapState.modification
      return <StopLayer
        allowSelect
        data={data}
        key={m.id + '_select'}
        modification={m}
        nullIsWildcard
        onSelect={(stop) => {
          this.props.replaceModification(updateAddStopsTerminus(m, mapState.which, stop))
          this.props.setMapState({})
        }}
        selectedColor={colors.ACTIVE}
        />
    }
  }
}
