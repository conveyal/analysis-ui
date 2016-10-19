import lonlng from 'lonlng'
import React, {Component, PropTypes} from 'react'
import {Marker} from 'react-leaflet'

import GeoJson from './geojson'

export default class Isochrone extends Component {
  static propTypes = {
    bundleId: PropTypes.string.isRequired,
    fetchIsochrone: PropTypes.func.isRequired,
    isochroneLatLng: PropTypes.object.isRequired,
    isochrone: PropTypes.object,
    modifications: PropTypes.array.isRequired,
    remove: PropTypes.func.isRequired,
    scenarioId: PropTypes.string.isRequired,
    currentIndicator: PropTypes.string.isRequired
  }

  render () {
    const {isochrone, isochroneCutoff, isochroneLatLng} = this.props
    return (
      <g>
        <Marker
          draggable
          onDblclick={this._handleDblclick}
          onDragend={this._handleDragend}
          position={isochroneLatLng}
          />
        {isochrone &&
          <GeoJson
            data={isochrone}
            key={`isochrone-${isochroneCutoff}-${lonlng.toString(isochroneLatLng)}`}
            style={{
              fillColor: '#2389c9',
              pointerEvents: 'none',
              stroke: false
            }}
            />}
      </g>
    )
  }

  _fetchIsochrone = (latlng) => {
    const {bundleId, fetchIsochrone, modifications, scenarioId, isochroneCutoff, currentIndicator} = this.props
    fetchIsochrone({
      bundleId,
      origin: latlng,
      modifications,
      scenarioId,
      isochroneCutoff,
      indicator: currentIndicator
    })
  }

  _handleDragend = (e) => {
    this._fetchIsochrone(e.target._latlng)
  }

  _handleDblclick = (e) => {
    this.props.remove()
  }
}
