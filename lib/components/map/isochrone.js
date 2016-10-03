import lonlng from 'lonlng'
import React, {Component, PropTypes} from 'react'
import {Marker} from 'react-leaflet'

import GeoJson from './geojson'

export default class Isochrone extends Component {
  static propTypes = {
    bundleId: PropTypes.string.isRequired,
    fetchIsochrone: PropTypes.func.isRequired,
    isochroneLatLng: PropTypes.object.isRequired,
    isochronesByCutoff: PropTypes.object,
    modifications: PropTypes.array.isRequired,
    remove: PropTypes.func.isRequired,
    scenarioId: PropTypes.string.isRequired
  }

  state = {
    stale: false
  }

  componentDidMount () {
    this._fetchIsochrone(this.props.isochroneLatLng)
  }

  componentWillReceiveProps (nextProps) {
    if (!lonlng.isEqual(this.props.isochroneLatLng, nextProps.isochroneLatLng) || !nextProps.isochronesByCutoff) {
      this._fetchIsochrone(nextProps.isochroneLatLng)
    }

    const isochronesDidNotChange = this.props.isochronesByCutoff === nextProps.isochronesByCutoff
    const scenarioChanged = this.props.scenarioId !== nextProps.scenarioId
    const modificationsChanged = this.props.modifications !== nextProps.modifications
    if (isochronesDidNotChange) {
      if (scenarioChanged || modificationsChanged) {
        this.setState({stale: true})
      }
    } else {
      this.setState({stale: false})
    }
  }

  render () {
    const {stale} = this.state
    const {isochronesByCutoff, isochroneCutoff, isochroneLatLng} = this.props
    return (
      <g>
        <Marker
          draggable
          onDblclick={this._handleDblclick}
          onDragend={this._handleDragend}
          position={isochroneLatLng}
          />
        {isochronesByCutoff && isochronesByCutoff[isochroneCutoff] &&
          <GeoJson
            data={isochronesByCutoff[isochroneCutoff]}
            key={`isochrone-${isochroneCutoff}-${lonlng.toString(isochroneLatLng)}-${stale}`}
            style={{
              fillColor: stale ? 'gray' : '#2389c9',
              pointerEvents: 'none',
              stroke: false
            }}
            />}
      </g>
    )
  }

  _fetchIsochrone = (latlng) => {
    const {bundleId, fetchIsochrone, modifications, scenarioId} = this.props
    fetchIsochrone({
      bundleId,
      latlng,
      modifications,
      scenarioId
    })
  }

  _handleDragend = (e) => {
    this._fetchIsochrone(e.target._latlng)
  }

  _handleDblclick = (e) => {
    this.props.remove()
  }
}
