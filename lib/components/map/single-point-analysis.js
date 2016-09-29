import React, {Component, PropTypes} from 'react'
import {Marker} from 'react-leaflet'

import GeoJson from './geojson'

export default class SinglePointAnalysis extends Component {
  static propTypes = {
    bundleId: PropTypes.string.isRequired,
    fetchIsochrone: PropTypes.func.isRequired,
    initialLatLng: PropTypes.object.isRequired,
    isochrone: PropTypes.object,
    modifications: PropTypes.array.isRequired,
    remove: PropTypes.func.isRequired,
    scenarioId: PropTypes.string.isRequired
  }

  state = {
    latlng: this.props.initialLatLng
  }

  componentDidMount () {
    this._fetchIsochrone(this.state.latlng)
  }

  componentWillReceiveProps (nextProps) {
    if (this.props.isochrone) {
      // dim isochrone
    }
  }

  render () {
    const {latlng} = this.state
    const {isochrone} = this.props
    return (
      <g>
        <Marker
          draggable
          onDblclick={this._handleDblclick}
          onDragend={this._handleDragend}
          position={latlng}
          />
        {isochrone &&
          <GeoJson
            data={isochrone}
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
    const latlng = e.target._latlng
    this.setState({latlng})
    this._fetchIsochrone(latlng)
  }

  _handleDblclick = (e) => {
    this.props.remove()
  }
}
