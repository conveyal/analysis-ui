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
    // default location: Washington, DC because that's where @mattwigway lives
    let center = this.props.bundle ? [this.props.bundle.centerLat, this.props.bundle.centerLon] : [38.8886, -77.0430]

    return <LeafletMap center={center} zoom={12}>
      <TileLayer url='http://{s}.tiles.mapbox.com/v3/conveyal.hml987j0/{z}/{x}/{y}.png'
        attribution={'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, ' +
        'Imagery © <a href="http://mapbox.com">Mapbox</a>'} />

      {/* show patterns at the bottom */}
      {(this.props.modifications ? [...this.props.modifications.values()] : [])
        .filter((m) => m.type === 'remove-trips' && m.showOnMap)
        .map((m) => <PatternLayer data={this.props.data} modification={m} color={colors.REMOVED} key={m.id} />)}

      {(this.props.modifications ? [...this.props.modifications.values()] : [])
        .filter((m) => (m.type === 'adjust-dwell-time' || m.type === 'convert-to-frequency') && m.showOnMap)
        .map((m) => <PatternLayer data={this.props.data} modification={m} color={colors.MODIFIED} key={m.id} />)}

      {/* show patterns with added or removed stop in neutral gray, the stops/reroutes themselves will be shown as red or blue depending on whether they are removed or added.*/}
      {(this.props.modifications ? [...this.props.modifications.values()] : [])
        .filter((m) => (m.type === 'remove-stops' || m.type === 'add-stops') && m.showOnMap)
        .map((m) => <PatternLayer data={this.props.data} modification={m} color={colors.NEUTRAL} key={m.id} />)}

      {(this.props.modifications ? [...this.props.modifications.values()] : [])
        .filter((m) => m.type === 'adjust-speed' && m.showOnMap)
        // show the full pattern in neutral gray, selection in purple
        .map((m) => [<PatternLayer data={this.props.data} modification={m} color={colors.NEUTRAL} key={m.id + 'full'} />,
          <HopLayer data={this.props.data} modification={m} color={colors.MODIFIED} key={m.id + 'segment'} />])}

      {/* removed stops in red */}
      {(this.props.modifications ? [...this.props.modifications.values()] : [])
        .filter((m) => m.type === 'remove-stops' && m.showOnMap)
        .map((m) => <StopLayer data={this.props.data} modification={m} selectedColor={colors.REMOVED} nullIsWildcard={false} key={m.id} />)}

      {/* adjusted dwell times in purple */}
      {(this.props.modifications ? [...this.props.modifications.values()] : [])
        .filter((m) => m.type === 'adjust-dwell-time' && m.showOnMap)
        .map((m) => <StopLayer data={this.props.data} modification={m} selectedColor={colors.MODIFIED} nullIsWildcard key={m.id} />)}

      {(this.props.modifications ? [...this.props.modifications.values()] : [])
        .filter((m) => m.type === 'add-stops' && m.showOnMap && (this.props.mapState.modification == null || this.props.mapState.modification.id !== m.id))
        .map((m) => <AddStopsLayer data={this.props.data} modification={m} />)}

      {/* Added trip patterns. */}
      {(this.props.modifications ? [...this.props.modifications.values()] : [])
        // hide trip pattern currently being edited
        .filter((m) => m.type === 'add-trip-pattern' && m.showOnMap && (this.props.mapState.modification === undefined || this.props.mapState.modification.id !== m.id))
        // NB: updating the props of a geojson layer does nothing, but we won't ever do that as the only time geometries change is when the modification has been updated
        // and we will have removed that modification from the map
        .map((m) => <GeoJson data={{
          type: 'Feature',
          properties: {},
          geometry: m.geometry
        }} color={colors.ADDED} weight={3} key={m.id} />)}

      {/* state-specific layers */}
      {(() => {
        if (this.props.mapState.state === 'stop-selection') {
          return <StopSelectPolygon modification={this.props.mapState.modification} action={this.props.mapState.action} routeStops={this.props.mapState.routeStops}
            replaceModification={this.props.replaceModification} setMapState={this.props.setMapState} />
        } else if (this.props.mapState.state === 'hop-selection') {
          return <HopSelectPolygon modification={this.props.mapState.modification} action={this.props.mapState.action}
            replaceModification={this.props.replaceModification} setMapState={this.props.setMapState} data={this.props.data} />
        } else if (this.props.mapState.state === 'add-trip-pattern') {
          let { stops, stopIds, geometry, controlPoints } = this.props.mapState.modification
          let snapStops = [].concat(...[...this.props.data.feeds.values()]
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
          let instance = new LeafletTransitEditor({ stops, stopIds, geometry, controlPoints, snapStops })

          return [<AddTripPatternLayer leafletTransitEditor={instance} />,
            <AddTripPatternControl leafletTransitEditor={instance} modification={this.props.mapState.modification} replaceModification={this.props.replaceModification}
              setMapState={this.props.setMapState} />]
        } else if (this.props.mapState.state === 'single-stop-selection') {
          let m = this.props.mapState.modification
          return <StopLayer data={this.props.data} modification={m} nullIsWildcard selectedColor={colors.ACTIVE} key={m.id + '_select'}
            allowSelect onSelect={(stop) => {
              console.log('updating terminus')
              this.props.replaceModification(updateAddStopsTerminus(m, this.props.mapState.which, stop))
              this.props.setMapState({})
            }} />
        } else return <span /> // can we have a span here?
      })()}
    </LeafletMap>
  }
}
