/** A map component showing a scenario */

import React, { Component } from 'react'
import { Map as LeafletMap, TileLayer } from 'react-leaflet'
import StopSelectPolygon from './stop-select-polygon'
import PatternLayer from './pattern-layer'
import StopLayer from './stop-layer'
import colors from '../colors'

export default class ScenarioMap extends Component {
  render () {
    return <LeafletMap center={[39.0970, -94.6053]} zoom={12}>
      <TileLayer url='http://{s}.tiles.mapbox.com/v3/conveyal.hml987j0/{z}/{x}/{y}.png'
        attribution={'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, ' +
        'Imagery © <a href="http://mapbox.com">Mapbox</a>'} />

      {/* show patterns at the bottom */}
      {(this.props.modifications ? [...this.props.modifications.values()] : [])
        .filter((m) => m.type === 'remove-trips' && m.showOnMap)
        .map((m) => <PatternLayer data={this.props.data} modification={m} color={colors.REMOVED} />)}

      {(this.props.modifications ? [...this.props.modifications.values()] : [])
        .filter((m) => (m.type === 'adjust-speed' || m.type === 'adjust-dwell-time' || m.type === 'convert-to-frequency') && m.showOnMap)
        .map((m) => <PatternLayer data={this.props.data} modification={m} color={colors.MODIFIED} />)}

      {/* show patterns with removed stop in neutral gray, the stops themselves will be shown as red.*/}
      {(this.props.modifications ? [...this.props.modifications.values()] : [])
        .filter((m) => m.type === 'remove-stops' && m.showOnMap)
        .map((m) => <PatternLayer data={this.props.data} modification={m} color={colors.NEUTRAL} />)}

      {/* removed stops in red */}
      {(this.props.modifications ? [...this.props.modifications.values()] : [])
        .filter((m) => m.type === 'remove-stops' && m.showOnMap)
        .map((m) => <StopLayer data={this.props.data} modification={m} selectedColor={colors.REMOVED} nullIsWildcard={false} />)}

      {/* adjusted dwell times in purple */}
      {(this.props.modifications ? [...this.props.modifications.values()] : [])
        .filter((m) => m.type === 'adjust-dwell-time' && m.showOnMap)
        .map((m) => <StopLayer data={this.props.data} modification={m} selectedColor={colors.MODIFIED} nullIsWildcard />)}

      {/* state-specific layers */}
      {(() => {
        if (this.props.mapState.state === 'stop-selection') {
          return <StopSelectPolygon modification={this.props.mapState.modification} action={this.props.mapState.action} routeStops={this.props.mapState.routeStops}
            replaceModification={this.props.replaceModification} setMapState={this.props.setMapState} />
        } else return <span /> // can we have a span here?
      })()}
    </LeafletMap>
  }
}
